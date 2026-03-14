#!/usr/bin/env bash
set -euo pipefail

print_help(){
  cat <<EOF
Usage: sudo bash bootstrap_server.sh --domain example.com --git-repo https://github.com/you/repo.git --email admin@example.com

This script runs on a fresh Ubuntu 22.04 server and will:
- install Docker and docker-compose plugin
- install nginx and certbot
- clone the repository
- create a production .env file interactively (or from env vars)
- start the application with docker compose
- configure nginx and obtain TLS cert via certbot
EOF
}

DOMAIN=""
GIT_REPO=""
EMAIL=""

while [[ $# -gt 0 ]]; do
  case $1 in
    --domain) DOMAIN="$2"; shift 2;;
    --git-repo) GIT_REPO="$2"; shift 2;;
    --email) EMAIL="$2"; shift 2;;
    -h|--help) print_help; exit 0;;
    *) echo "Unknown arg: $1"; print_help; exit 1;;
  esac
done

if [[ -z "$DOMAIN" || -z "$GIT_REPO" ]]; then
  echo "Missing required arguments." >&2
  print_help
  exit 1
fi

if [[ $(id -u) -ne 0 ]]; then
  echo "This script must be run as root (sudo)." >&2
  exit 1
fi

# Update and install dependencies
apt update && apt upgrade -y
apt install -y curl git ufw nginx certbot python3-certbot-nginx

# Install Docker
if ! command -v docker >/dev/null 2>&1; then
  curl -fsSL https://get.docker.com -o get-docker.sh
  sh get-docker.sh
  # Add ubuntu user to docker group if it exists, otherwise assume root
  if id ubuntu >/dev/null 2>&1; then
    usermod -aG docker ubuntu
  fi
fi

# Install docker compose plugin
if ! docker compose version >/dev/null 2>&1; then
  apt install -y docker-compose-plugin
fi

# Firewall
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

# Clone the repo into /opt/ai-consultant
WORKDIR=/opt/ai-consultant
rm -rf "$WORKDIR"
mkdir -p "$WORKDIR"
# Determine owner: ubuntu if exists, otherwise root
if id ubuntu >/dev/null 2>&1; then
  OWNER=ubuntu:ubuntu
else
  OWNER=root:root
fi
chown "$OWNER" "$WORKDIR"
OWNER_USER="${OWNER%%:*}"

if [[ "$OWNER_USER" == "root" ]]; then
  git clone "$GIT_REPO" "$WORKDIR" || (cd "$WORKDIR" && git pull)
else
  sudo -u "$OWNER_USER" git clone "$GIT_REPO" "$WORKDIR" || (cd "$WORKDIR" && sudo -u "$OWNER_USER" git pull)
fi

# Create .env.production
ENV_FILE="$WORKDIR/.env.production"
if [[ -f "$ENV_FILE" ]]; then
  echo ".env.production already exists at $ENV_FILE; leave as is or edit manually."
else
  PG_PASS=$(openssl rand -base64 16)
  JWT_KEY=$(openssl rand -base64 32)
  cat > "$ENV_FILE" <<EOF
# Basic production env - EDIT these values
ASPNETCORE_ENVIRONMENT=Production
ASPNETCORE_URLS=http://+:8080

# Postgres - POSTGRES_PASSWORD is used by both the postgres container and the connection string
POSTGRES_PASSWORD=${PG_PASS}
ConnectionStrings__DefaultConnection=Host=postgres;Port=5432;Database=aiconsultant;Username=postgres;Password=${PG_PASS}

# JWT
JwtSettings__SecretKey=${JWT_KEY}
JwtSettings__Issuer=AiConsultantAPI
JwtSettings__Audience=AiConsultantClient
JwtSettings__ExpirationHours=24

# Admin account seeded on startup
AdminSettings__Email=admin@${DOMAIN}
AdminSettings__Password=Admin@123

# CORS - must match the public domain
AllowedOrigins=https://${DOMAIN}
EOF
  chown "$OWNER" "$ENV_FILE"
  chmod 600 "$ENV_FILE"
  echo "Created $ENV_FILE (please edit credentials if needed)."
fi

# Start docker compose
# Bug fix: use $OWNER_USER (computed above) instead of hardcoded 'ubuntu'
cd "$WORKDIR"
sudo -u "$OWNER_USER" docker compose --env-file "$ENV_FILE" up -d --build

# Configure nginx site
# Bug fix: use quoted heredoc (<<'EOF') so $host, $scheme etc. are treated as
# Nginx variables, not expanded as empty shell variables.
NGINX_CONF="/etc/nginx/sites-available/ai-consultant"
cat > "$NGINX_CONF" <<'NGINXEOF'
server {
  listen 80;
  server_name DOMAIN_PLACEHOLDER www.DOMAIN_PLACEHOLDER;

  # Forward everything to the frontend container (port 3000).
  # The frontend's internal nginx already proxies /api/ to the backend,
  # so there is no need to route /api/ separately here.
  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
  }
}
NGINXEOF

# Substitute the actual domain into the config (sed is safe here — no shell vars in content)
sed -i "s/DOMAIN_PLACEHOLDER/${DOMAIN}/g" "$NGINX_CONF"

ln -sf "$NGINX_CONF" /etc/nginx/sites-enabled/ai-consultant
nginx -t && systemctl reload nginx

# Obtain TLS cert
if [[ -n "$EMAIL" ]]; then
  certbot --nginx -n --agree-tos --email "$EMAIL" -d "$DOMAIN" -d "www.${DOMAIN}"
else
  certbot --nginx -n --agree-tos --register-unsafely-without-email -d "$DOMAIN" -d "www.${DOMAIN}"
fi

# Restart services
systemctl restart nginx

echo "Bootstrap complete. Visit https://${DOMAIN}"
echo "If you used the default DB settings (containerized postgres), consider switching to a managed DB for production backups."

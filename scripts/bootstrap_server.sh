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
  usermod -aG docker ubuntu || true
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
chown ubuntu:ubuntu "$WORKDIR"

sudo -u ubuntu git clone "$GIT_REPO" "$WORKDIR" || (cd "$WORKDIR" && sudo -u ubuntu git pull)

# Create .env.production
ENV_FILE="$WORKDIR/.env.production"
if [[ -f "$ENV_FILE" ]]; then
  echo ".env.production already exists at $ENV_FILE; leave as is or edit manually."
else
  cat > "$ENV_FILE" <<EOF
# Basic production env - EDIT these values
ASPNETCORE_ENVIRONMENT=Production
ASPNETCORE_URLS=http://+:8080
ConnectionStrings__DefaultConnection=Host=postgres;Port=5432;Database=aiconsultant;Username=postgres;Password=postgres123
JwtSettings__SecretKey=$(openssl rand -base64 32)
JwtSettings__Issuer=AiConsultantAPI
JwtSettings__Audience=AiConsultantClient
JwtSettings__ExpirationHours=24
AdminSettings__Email=admin@${DOMAIN}
AdminSettings__Password=Admin@123
AllowedOrigins=https://${DOMAIN}
EOF
  chown ubuntu:ubuntu "$ENV_FILE"
  echo "Created $ENV_FILE (please edit credentials if needed)."
fi

# Start docker compose
cd "$WORKDIR"
# Use the compose file in repo root; ensure docker has permission
sudo -u ubuntu docker compose --env-file "$ENV_FILE" up -d --build

# Configure nginx site
NGINX_CONF="/etc/nginx/sites-available/ai-consultant"
cat > "$NGINX_CONF" <<EOF
server {
  listen 80;
  server_name ${DOMAIN} www.${DOMAIN};

  location /api/ {
    proxy_pass http://127.0.0.1:5000/;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }

  location / {
    proxy_pass http://127.0.0.1:3000/;
    proxy_set_header Host $host;
  }
}
EOF

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

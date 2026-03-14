#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# server_fix.sh — Run as root on the server to repair/redeploy the stack.
# Expects .env.production to already exist at $PROJ/.env.production
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

REPO="https://github.com/saaritsolutions/ai-consultant.git"
DOMAIN="AISaarITSolutions.com"
SERVER_IP="89.167.53.218"

echo "=============================="
echo " AI Consultant — Server Fix"
echo "=============================="

# ── 1. Find or clone project ──────────────────────────────────────────────────
PROJ=""
for d in /root/ai-consultant /opt/ai-consultant; do
  [ -d "$d/.git" ] && PROJ="$d" && break
done

if [[ -z "$PROJ" ]]; then
  echo "No existing clone found — cloning from GitHub..."
  git clone "$REPO" /opt/ai-consultant
  PROJ=/opt/ai-consultant
fi

echo "Project directory: $PROJ"
cd "$PROJ"

# ── 2. Pull latest code ───────────────────────────────────────────────────────
echo ""
echo "Pulling latest code from GitHub..."
git fetch origin
git reset --hard origin/master

# ── 3. Verify .env.production exists ─────────────────────────────────────────
ENV_FILE="$PROJ/.env.production"
if [[ ! -f "$ENV_FILE" ]]; then
  echo ""
  echo "ERROR: $ENV_FILE not found."
  echo "Create it first (see README or instructions from your deployment guide)."
  exit 1
fi
echo "Using env file: $ENV_FILE"
chmod 600 "$ENV_FILE"

# ── 4. Stop ALL old containers and remove volumes for a clean restart ─────────
echo ""
echo "Stopping old containers and removing volumes (fresh DB start)..."
docker compose down -v 2>/dev/null || true

# ── 5. Build and start ────────────────────────────────────────────────────────
echo ""
echo "Building and starting containers with production env..."
docker compose --env-file "$ENV_FILE" up -d --build

echo ""
echo "Waiting 30s for services to initialise (DB migration + seed)..."
sleep 30

# ── 6. Verify containers are up ───────────────────────────────────────────────
echo ""
echo "=== Container Status ==="
docker compose ps

echo ""
echo "=== Backend logs (last 30 lines) ==="
docker compose logs --tail=30 backend

# ── 7. Fix Nginx config ───────────────────────────────────────────────────────
echo ""
echo "Writing Nginx config..."
cat > /etc/nginx/sites-available/ai-consultant << 'NGINXEOF'
server {
    listen 80;
    server_name DOMAIN_PH www.DOMAIN_PH SERVER_IP_PH;

    # Forward everything to the frontend container (port 3000).
    # The frontend's internal nginx handles /api/ proxying to the backend
    # using Docker service names — no hardcoded container IPs needed.
    location / {
        proxy_pass         http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection 'upgrade';
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
NGINXEOF

sed -i "s/DOMAIN_PH/${DOMAIN}/g; s/SERVER_IP_PH/${SERVER_IP}/g" \
  /etc/nginx/sites-available/ai-consultant

# Enable site and remove default if present
ln -sf /etc/nginx/sites-available/ai-consultant /etc/nginx/sites-enabled/ai-consultant
rm -f /etc/nginx/sites-enabled/default

nginx -t && systemctl reload nginx
echo "Nginx reloaded."

# ── 8. SSL cert (certbot) ─────────────────────────────────────────────────────
if ! certbot certificates 2>/dev/null | grep -q "$DOMAIN"; then
  echo ""
  echo "Obtaining SSL certificate for ${DOMAIN}..."
  certbot --nginx -n --agree-tos --register-unsafely-without-email \
    -d "$DOMAIN" -d "www.${DOMAIN}" || \
    echo "WARNING: certbot failed — make sure DNS for ${DOMAIN} points to this server IP."
else
  echo "SSL cert already exists for ${DOMAIN}."
fi

systemctl reload nginx

# ── 9. Final smoke test ───────────────────────────────────────────────────────
echo ""
echo "=== Quick smoke tests ==="
echo -n "Frontend (port 3000): "
curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000 || echo "FAIL"

echo ""
echo -n "Backend API (/api/blogs via frontend proxy): "
curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000/api/blogs || echo "FAIL"

echo ""
echo "=============================="
echo " Done! Visit https://${DOMAIN}"
echo "=============================="

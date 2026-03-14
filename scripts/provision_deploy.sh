#!/usr/bin/env bash
set -euo pipefail

# Simple provisioning + deploy helper (DigitalOcean support).
# Usage example:
# bash scripts/provision_deploy.sh \
#   --provider digitalocean \
#   --do-token YOUR_DO_TOKEN \
#   --ssh-key-id YOUR_SSH_KEY_FINGERPRINT \
#   --domain example.com \
#   --git-repo https://github.com/youruser/ai-consultant.git \
#   --email admin@example.com

print_help(){
  cat <<EOF
Usage: $0 --provider digitalocean --do-token TOKEN --ssh-key-id SSH_KEY_ID \
      --domain DOMAIN --git-repo GIT_REPO [--droplet-name NAME] [--region REGION]

This script requires 'doctl' for DigitalOcean provisioning. If you don't want automatic
provisioning, run the included bootstrap_server.sh directly on a fresh Ubuntu 22.04 server.
EOF
}

# Defaults
PROVIDER=""
DO_TOKEN=""
SSH_KEY_ID=""
DOMAIN=""
GIT_REPO=""
EMAIL=""
DROPLET_NAME="ai-consultant-droplet"
REGION="nyc3"
SIZE="s-1vcpu-1gb"

while [[ $# -gt 0 ]]; do
  case $1 in
    --provider) PROVIDER="$2"; shift 2;;
    --do-token) DO_TOKEN="$2"; shift 2;;
    --ssh-key-id) SSH_KEY_ID="$2"; shift 2;;
    --domain) DOMAIN="$2"; shift 2;;
    --git-repo) GIT_REPO="$2"; shift 2;;
    --email) EMAIL="$2"; shift 2;;
    --droplet-name) DROPLET_NAME="$2"; shift 2;;
    --region) REGION="$2"; shift 2;;
    --size) SIZE="$2"; shift 2;;
    -h|--help) print_help; exit 0;;
    *) echo "Unknown arg: $1"; print_help; exit 1;;
  esac
done

if [[ "$PROVIDER" != "digitalocean" ]]; then
  echo "Only 'digitalocean' provider supported by this script. If you prefer another provider,
copy scripts/bootstrap_server.sh to a fresh Ubuntu 22.04 server and run it there." >&2
  exit 1
fi

if [[ -z "$DO_TOKEN" || -z "$SSH_KEY_ID" || -z "$DOMAIN" || -z "$GIT_REPO" ]]; then
  echo "Missing required arguments." >&2
  print_help
  exit 1
fi

# Check doctl
if ! command -v doctl >/dev/null 2>&1; then
  echo "doctl not found. Attempting to install via snap..."
  if command -v snap >/dev/null 2>&1; then
    sudo snap install doctl
  else
    echo "snap not available; please install doctl manually: https://docs.digitalocean.com/reference/doctl/" >&2
    exit 1
  fi
fi

# Authenticate doctl
echo "$DO_TOKEN" | doctl auth init --access-token - >/dev/null

echo "Creating droplet '$DROPLET_NAME' in region $REGION (size $SIZE)..."
DROPLET_ID=$(doctl compute droplet create "$DROPLET_NAME" --region "$REGION" --image ubuntu-22-04-x64 \
  --size "$SIZE" --ssh-keys "$SSH_KEY_ID" --format ID --no-header)

if [[ -z "$DROPLET_ID" ]]; then
  echo "Failed to create droplet." >&2
  exit 1
fi

echo "Waiting for droplet to get an IP..."
# poll for public IP
IP=""
for i in {1..30}; do
  sleep 4
  IP=$(doctl compute droplet get "$DROPLET_ID" --format PublicIPv4 --no-header 2>/dev/null || true)
  if [[ -n "$IP" && "$IP" != "<none>" ]]; then break; fi
  echo -n '.'
done

if [[ -z "$IP" ]]; then
  echo "Could not determine droplet IP." >&2
  exit 1
fi

echo "Droplet available at $IP"

# Bug fix: wait for SSH to be ready before connecting.
# Fresh droplets take 30-60 seconds after getting an IP before SSH is responsive.
echo "Waiting for SSH to become available on $IP..."
SSH_OPTS="-o StrictHostKeyChecking=no -o ConnectTimeout=8 -o BatchMode=yes"
for i in {1..30}; do
  if ssh $SSH_OPTS ubuntu@"$IP" "true" 2>/dev/null; then
    echo "SSH is ready."
    break
  fi
  echo -n '.'
  sleep 5
done

# Verify SSH is actually up (fail fast if not)
if ! ssh $SSH_OPTS ubuntu@"$IP" "true" 2>/dev/null; then
  echo "SSH did not become available in time. Check your SSH key and droplet status." >&2
  exit 1
fi

echo "Copying bootstrap script to droplet and running it."
# Bug fix: add StrictHostKeyChecking=no so the script does not hang on first connect
scp $SSH_OPTS scripts/bootstrap_server.sh ubuntu@"${IP}":~/bootstrap_server.sh

# Build remote command with required args
# Bug fix: prefix with 'sudo' — bootstrap_server.sh requires root
REMOTE_CMD="sudo bash ~/bootstrap_server.sh --domain ${DOMAIN} --git-repo '${GIT_REPO}' --email '${EMAIL}'"

ssh $SSH_OPTS ubuntu@"${IP}" "$REMOTE_CMD"

echo "Provisioning and deployment finished. Visit: https://${DOMAIN} (give certbot a minute to finish)"

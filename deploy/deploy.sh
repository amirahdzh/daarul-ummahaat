#!/usr/bin/env bash
# Deploys one image to this server. Run by GitHub Actions, and safe to run by hand:
#
#   ./deploy.sh ghcr.io/<owner>/<repo>:<tag>
#
# What it does: safety dump of the database -> pull the image -> restart the stack ->
# wait for the health check -> roll back to the previous image if the new one does not come up.
#
# Registry login: if GHCR_USER is set and a token is piped in on stdin, it logs in first.
# Testing without a registry: DEPLOY_SKIP_PULL=1 uses an image that already exists locally.
set -euo pipefail
cd "$(dirname "$(readlink -f "$0")")"

IMAGE="${1:?usage: deploy.sh <image>}"
HEALTH_TIMEOUT="${HEALTH_TIMEOUT:-180}"
DC=./dc

log() { echo "[$(date +%H:%M:%S)] $*"; }

# Only accept sane image names. This script is reachable over SSH, so treat its input carefully.
if [[ ! "$IMAGE" =~ ^[a-z0-9][a-z0-9._/:@-]*$ ]]; then
  echo "Refusing an unexpected image name: $IMAGE" >&2
  exit 2
fi
[ -f .env ] || { echo "Missing /opt/daarul/.env. Copy env.production.example to .env and fill it in." >&2; exit 2; }

# --- Registry login (token arrives on stdin, never on the command line) -------------------------------
if [ -n "${GHCR_USER:-}" ] && [ ! -t 0 ]; then
  IFS= read -r GHCR_TOKEN || true
  if [ -n "${GHCR_TOKEN:-}" ]; then
    log "Logging in to ghcr.io as $GHCR_USER"
    printf '%s' "$GHCR_TOKEN" | docker login ghcr.io -u "$GHCR_USER" --password-stdin >/dev/null
  fi
fi

app_health() {
  local id
  id="$($DC ps -q app 2>/dev/null || true)"
  [ -n "$id" ] || { echo "missing"; return; }
  docker inspect -f '{{if .State.Running}}{{if .State.Health}}{{.State.Health.Status}}{{else}}running{{end}}{{else}}stopped{{end}}' "$id" 2>/dev/null || echo "missing"
}

wait_healthy() {
  local waited=0
  while [ "$waited" -lt "$HEALTH_TIMEOUT" ]; do
    [ "$(app_health)" = "healthy" ] && return 0
    sleep 3
    waited=$((waited + 3))
  done
  return 1
}

PREVIOUS=""
[ -f image.env ] && PREVIOUS="$(sed -n 's/^APP_IMAGE=//p' image.env | head -n1)"
[ "$PREVIOUS" = "daarul-app:unset" ] && PREVIOUS=""

# --- Safety dump before anything changes --------------------------------------------------------------
if [ -n "$($DC ps -q --status running db 2>/dev/null || true)" ]; then
  mkdir -p backups
  DUMP="backups/pre-deploy-$(date +%Y%m%d-%H%M%S).dump"
  log "Saving a database dump to $DUMP"
  $DC exec -T db pg_dump -U daarul -Fc daarul > "$DUMP"
  # Keep the five most recent.
  ls -1t backups/pre-deploy-*.dump 2>/dev/null | tail -n +6 | xargs -r rm --
fi

# --- Pull and switch ----------------------------------------------------------------------------------
if [ "${DEPLOY_SKIP_PULL:-0}" != "1" ]; then
  log "Pulling $IMAGE"
  docker pull "$IMAGE"
fi

log "Building the backup job image (cached unless it changed)"
$DC --profile tools build backup >/dev/null

echo "APP_IMAGE=$IMAGE" > image.env
log "Starting the stack with $IMAGE"
$DC up -d --remove-orphans

# If this stack runs its own Caddy (COMPOSE_PROFILES=standalone), it keeps its configuration in memory, so a
# changed Caddyfile only takes effect after a reload. The reload checks the file first and keeps the old
# configuration if the new one is invalid. With a Caddy installed on the host there is nothing to do here.
if [ -n "$($DC ps -q --status running caddy 2>/dev/null || true)" ]; then
  log "Reloading the web server configuration"
  if ! $DC exec -T caddy caddy reload --config /etc/caddy/Caddyfile --force >/dev/null 2>&1; then
    log "Caddy could not load the new Caddyfile. The old configuration is still running. Check: ./dc exec caddy caddy validate --config /etc/caddy/Caddyfile"
    exit 1
  fi
fi

log "Waiting for the app to become healthy (up to ${HEALTH_TIMEOUT}s)"
if wait_healthy; then
  log "Healthy."
  # Tidy up, but keep images from the last 7 days so a rollback stays possible.
  docker image prune -af --filter "until=168h" >/dev/null 2>&1 || true
  $DC ps
  log "Deployed $IMAGE"
  exit 0
fi

# --- Roll back ----------------------------------------------------------------------------------------
log "The new version did not become healthy. Recent logs:"
$DC logs --tail 60 app || true

if [ -n "$PREVIOUS" ] && [ "$PREVIOUS" != "$IMAGE" ]; then
  log "Rolling back to $PREVIOUS"
  echo "APP_IMAGE=$PREVIOUS" > image.env
  $DC up -d app
  if wait_healthy; then
    log "Rolled back. The site is running the previous version."
  else
    log "The previous version is not healthy either. Check: cd /opt/daarul && ./dc logs app"
  fi
else
  log "There is no previous version to roll back to."
fi
log "If a database migration ran, restore from the latest file in /opt/daarul/backups (see docs/deployment.md)."
exit 1

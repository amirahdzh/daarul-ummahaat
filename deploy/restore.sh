#!/usr/bin/env bash
# Restores the database and uploaded files from a backup. This REPLACES the current content.
#
#   ./restore.sh              restore the latest backup
#   ./restore.sh <id>         restore a specific snapshot (list them with: ./dc --profile tools run --rm backup restic snapshots)
#   ./restore.sh --yes ...    skip the confirmation question
set -euo pipefail
cd "$(dirname "$(readlink -f "$0")")"

ASSUME_YES=0
if [ "${1:-}" = "--yes" ]; then ASSUME_YES=1; shift; fi
SNAPSHOT="${1:-latest}"
DC=./dc

log() { echo "[$(date +%H:%M:%S)] $*"; }

echo "This will REPLACE the website's database and uploaded files with backup '$SNAPSHOT'."
echo "Anything added after that backup will be lost."
if [ "$ASSUME_YES" != "1" ]; then
  read -r -p "Type RESTORE to continue: " answer
  [ "$answer" = "RESTORE" ] || { echo "Cancelled."; exit 1; }
fi

mkdir -p backups
SAFETY="backups/pre-restore-$(date +%Y%m%d-%H%M%S).dump"
log "Saving the current database to $SAFETY (in case you change your mind)"
$DC exec -T db pg_dump -U daarul -Fc daarul > "$SAFETY"

log "Stopping the app"
$DC stop app

log "Restoring '$SNAPSHOT'"
$DC --profile tools run --rm restore restore "$SNAPSHOT"

log "Starting the app"
$DC up -d app

for _ in $(seq 1 60); do
  id="$($DC ps -q app)"
  status="$(docker inspect -f '{{if .State.Health}}{{.State.Health.Status}}{{end}}' "$id" 2>/dev/null || true)"
  if [ "$status" = "healthy" ]; then log "The site is back up with the restored content."; exit 0; fi
  sleep 3
done
log "The app did not become healthy. Check: ./dc logs app"
exit 1

#!/bin/sh
# Backs up the database and uploaded files to the restic repository (Cloudflare R2).
#
#   backup.sh                 run a backup, apply retention, spot-check the repository
#   backup.sh restic <args>   run any restic command against the repository (snapshots, ...)
#   backup.sh restore [id]    put a snapshot (default: latest) back: database and media files.
#                             Used by restore.sh, which stops the app first.
set -eu

log() { echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] $*"; }

ping() { # $1 = "", "/start" or "/fail"
  [ -n "${HEALTHCHECK_URL:-}" ] || return 0
  curl -fsS -m 10 --retry 2 "${HEALTHCHECK_URL}${1}" >/dev/null 2>&1 || log "warning: could not reach the health check URL"
}

if [ "${1:-}" = "restic" ]; then
  shift
  exec restic "$@"
fi

: "${RESTIC_REPOSITORY:?RESTIC_REPOSITORY is not set}"
: "${RESTIC_PASSWORD:?RESTIC_PASSWORD is not set}"

if [ "${1:-}" = "restore" ]; then
  SNAPSHOT="${2:-latest}"
  TARGET=/tmp/restore
  rm -rf "$TARGET" && mkdir -p "$TARGET"
  log "Fetching snapshot '$SNAPSHOT' from the repository"
  restic restore "$SNAPSHOT" --tag daarul --target "$TARGET"
  [ -s "$TARGET/tmp/dump/daarul.dump" ] || { log "The snapshot has no database dump"; exit 1; }

  log "Restoring the database (existing tables are replaced)"
  pg_restore --clean --if-exists --no-owner --no-privileges --dbname "$PGDATABASE" "$TARGET/tmp/dump/daarul.dump"

  log "Restoring media files (existing files are replaced)"
  find /data/media -mindepth 1 -delete
  if [ -d "$TARGET/data/media" ]; then cp -a "$TARGET/data/media/." /data/media/; fi

  rm -rf "$TARGET"
  log "Restore finished"
  exit 0
fi

DUMP_DIR=/tmp/dump
DUMP="$DUMP_DIR/daarul.dump"
KEEP_DAILY="${BACKUP_KEEP_DAILY:-7}"
KEEP_WEEKLY="${BACKUP_KEEP_WEEKLY:-4}"

trap 'log "BACKUP FAILED"; ping /fail; exit 1' EXIT
ping /start

if ! restic cat config >/dev/null 2>&1; then
  log "No repository found. Creating one."
  restic init
fi

log "Dumping the database"
mkdir -p "$DUMP_DIR"
pg_dump --format=custom --no-owner --no-privileges --file "$DUMP"
[ -s "$DUMP" ] || { log "The database dump is empty"; exit 1; }

log "Uploading database dump and media files"
# Same paths every run, so restic only uploads what changed.
restic backup --tag daarul --host daarul "$DUMP_DIR" /data/media

log "Applying retention: $KEEP_DAILY daily, $KEEP_WEEKLY weekly"
restic forget --tag daarul --host daarul --keep-daily "$KEEP_DAILY" --keep-weekly "$KEEP_WEEKLY" --prune

log "Checking the repository (5% sample)"
restic check --read-data-subset=5%

rm -rf "$DUMP_DIR"
trap - EXIT
log "Backup finished"
ping ""

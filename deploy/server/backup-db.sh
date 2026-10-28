#!/bin/bash
# Installed on the VPS at /etc/cron.daily/lind-db-backup.
# Daily gzip'd pg_dump of the Lind Society database, kept for 14 days.
set -euo pipefail
dir=/opt/lind-society/backups
mkdir -p "$dir"
docker exec lind-backend-postgres-1 sh -c 'pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB"' \
  | gzip > "$dir/db-$(date +%F).sql.gz"
find "$dir" -name 'db-*.sql.gz' -mtime +14 -delete

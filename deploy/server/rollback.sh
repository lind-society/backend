#!/bin/bash
# Installed on the VPS at /opt/lind_society/bin/rollback.sh. Run it yourself over
# SSH; the CI key cannot call it.
#
# Usage: rollback.sh <backend|frontend|frontend-user> [vN]
#
# Makes previous/vN (default: the newest) the live version again. The version
# being replaced is archived as the next previous/vM, so nothing is lost and a
# rollback can itself be rolled back.
set -euo pipefail

app="${1:-}"
want="${2:-}"
root=/opt/lind_society

case "$app" in
  backend)       port=18082 ;;
  frontend)      port=18081 ;;
  frontend-user) port=18080 ;;
  *) echo "usage: rollback.sh <backend|frontend|frontend-user> [vN]" >&2; exit 2 ;;
esac

exec 9>"$root/.deploy-$app.lock"
flock 9

base="$root/$app"
live="$base/current"
prev="$base/previous"

nums=$(ls -1 "$prev" 2>/dev/null | sed -n 's/^v\([0-9]\+\)$/\1/p' | sort -n)
[ -n "$nums" ] || { echo "no previous versions for $app" >&2; exit 1; }

target="${want:-v$(echo "$nums" | tail -n 1)}"
[ -d "$prev/$target" ] || { echo "no such version: $target (have: $(echo $nums | sed 's/\b/v/g'))" >&2; exit 1; }

next="v$(( $(echo "$nums" | tail -n 1) + 1 ))"
mv "$live" "$prev/$next"
mv "$prev/$target" "$live"
echo "$app: $target is live again; the replaced version is kept as $next"

cd "$live"
docker compose -f docker-compose.prod.yml up -d --build --remove-orphans

for _ in $(seq 1 40); do
  code=$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:$port/" || true)
  [ "$code" != "000" ] && [ "$code" -lt 500 ] && { echo "== healthy"; exit 0; }
  sleep 3
done
echo "!! $app did not become healthy after rollback" >&2
exit 1

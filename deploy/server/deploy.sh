#!/bin/bash
# Installed on the VPS at /opt/lind-society/bin/deploy.sh.
#
# Usage: deploy.sh <backend|frontend|frontend-user> < source.tar.gz
#
# Unpacks the source next to the live copy, adds the server-only env file,
# builds and swaps the containers. If the build or the health check fails, the
# previous source is put back and its containers restarted, so a broken commit
# never leaves the app down.
set -euo pipefail

app="${1:-}"
root=/opt/lind-society

case "$app" in
  backend)       env_name=.env;            port=18082 ;;
  frontend)      env_name=.env.production; port=18081 ;;
  frontend-user) env_name=.env.production; port=18080 ;;
  *) echo "unknown app: '$app'" >&2; exit 2 ;;
esac

exec 9>"$root/.deploy-$app.lock"
flock 9

live="$root/$app"
new="$root/$app.new"
old="$root/$app.old"

rm -rf "$new"
mkdir -p "$new"
tar -xz -C "$new"
cp "$root/env/$app.env" "$new/$env_name"

rm -rf "$old"
[ -d "$live" ] && mv "$live" "$old"
mv "$new" "$live"

compose() { docker compose -f docker-compose.prod.yml "$@"; }

healthy() {
  for _ in $(seq 1 40); do
    code=$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:$port/" || true)
    [ "$code" != "000" ] && [ "$code" -lt 500 ] && return 0
    sleep 3
  done
  return 1
}

rollback() {
  echo "!! deploy of $app failed, restoring previous version" >&2
  if [ -d "$old" ]; then
    rm -rf "$live"
    mv "$old" "$live"
    (cd "$live" && compose up -d --build --remove-orphans) || true
  fi
  exit 1
}

cd "$live"
compose up -d --build --remove-orphans || rollback
healthy || rollback

docker image prune -f >/dev/null
echo "== $app deployed ($(date -Is))"
compose ps

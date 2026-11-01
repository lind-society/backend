#!/bin/bash
# Installed on the VPS at /opt/lind_society/bin/deploy.sh.
#
# Usage: deploy.sh <backend|frontend|frontend-user> < source.tar.gz
#
# Layout (per app):
#   /opt/lind_society/<app>/current        the version that is live now
#   /opt/lind_society/<app>/previous/v1    older versions, oldest first
#   /opt/lind_society/<app>/previous/v2    ... numbers only go up, never reused
#
# A deploy unpacks the new source next to `current`, archives `current` as the
# next previous/vN, swaps the new source in, then builds and starts it. If the
# build or health check fails, that same vN is put back as `current` and its
# containers restarted, so a broken commit never leaves the app down.
# The newest $KEEP archives are kept; older ones are deleted.
set -euo pipefail

app="${1:-}"
root=/opt/lind_society
KEEP="${KEEP:-5}"

case "$app" in
  backend)       env_name=.env;            port=18082 ;;
  frontend)      env_name=.env.production; port=18081 ;;
  frontend-user) env_name=.env.production; port=18080 ;;
  *) echo "unknown app: '$app'" >&2; exit 2 ;;
esac

exec 9>"$root/.deploy-$app.lock"
flock 9

base="$root/$app"
live="$base/current"
prev="$base/previous"
new="$base/.new"
mkdir -p "$prev"

# One-time move from the old flat layout (/opt/lind_society/<app>/docker-compose.prod.yml).
if [ ! -d "$live" ] && [ -f "$base/docker-compose.prod.yml" ]; then
  legacy="$root/.$app.legacy"
  rm -rf "$legacy"
  mkdir -p "$legacy"
  find "$base" -mindepth 1 -maxdepth 1 ! -name previous -exec mv {} "$legacy"/ \;
  mv "$legacy" "$live"
fi

# Next archive number: highest existing vN + 1.
last=$(ls -1 "$prev" 2>/dev/null | sed -n 's/^v\([0-9]\+\)$/\1/p' | sort -n | tail -n 1)
version="v$(( ${last:-0} + 1 ))"
archived=""

rm -rf "$new"
mkdir -p "$new"
tar -xz -C "$new"
cp "$root/env/$app.env" "$new/$env_name"
date -Is > "$new/.deployed-at"

if [ -d "$live" ]; then
  mv "$live" "$prev/$version"
  archived="$prev/$version"
fi
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
  if [ -n "$archived" ] && [ -d "$archived" ]; then
    rm -rf "$live"
    mv "$archived" "$live"
    (cd "$live" && compose up -d --build --remove-orphans) || true
  fi
  exit 1
}

cd "$live"
compose up -d --build --remove-orphans || rollback
healthy || rollback

# Keep only the newest $KEEP archives.
ls -1 "$prev" | sed -n 's/^v\([0-9]\+\)$/\1/p' | sort -n | head -n "-$KEEP" \
  | while read -r n; do rm -rf "$prev/v$n"; done

docker image prune -f >/dev/null
echo "== $app deployed ($(date -Is)); previous kept as $version"
compose ps

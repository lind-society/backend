#!/bin/sh
# Usage: start.sh <main|external-gateway|mail|whatsapp|migrate>
set -e
app="$1"

if [ "$app" = "migrate" ]; then
  export TS_NODE_BASEURL=./dist/apps/main
  exec node -r tsconfig-paths/register node_modules/typeorm/cli.js \
    migration:run -d dist/apps/main/apps/main/src/database/data-source.js
fi

if [ "$app" = "whatsapp" ]; then
  # Chromium's profile lock survives in the session volume when the container
  # is replaced (every deploy). It names the old container's hostname, so the
  # new one refuses to launch ("profile appears to be in use by another
  # computer") and no QR is ever produced. Nothing else uses this profile.
  find /app/session -name 'Singleton*' -exec rm -f {} + 2>/dev/null || true
fi

export TS_NODE_BASEURL="./dist/apps/$app"
exec node -r tsconfig-paths/register "dist/apps/$app/apps/$app/src/main.js"

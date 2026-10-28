#!/bin/sh
# Usage: start.sh <main|external-gateway|mail|whatsapp|migrate>
set -e
app="$1"

if [ "$app" = "migrate" ]; then
  export TS_NODE_BASEURL=./dist/apps/main
  exec node -r tsconfig-paths/register node_modules/typeorm/cli.js \
    migration:run -d dist/apps/main/apps/main/src/database/data-source.js
fi

export TS_NODE_BASEURL="./dist/apps/$app"
exec node -r tsconfig-paths/register "dist/apps/$app/apps/$app/src/main.js"

#!/bin/bash
# Installed on the VPS at /opt/lind-society/bin/deploy-gate.sh and set as the
# forced command of the CI deploy key in root's authorized_keys, so that key
# can run `deploy <app>` and nothing else.
set -euo pipefail
read -r verb app extra <<<"${SSH_ORIGINAL_COMMAND:-}"
if [ "$verb" != "deploy" ] || [ -n "${extra:-}" ]; then
  echo "denied: only 'deploy <app>' is allowed" >&2
  exit 1
fi
exec /opt/lind-society/bin/deploy.sh "$app"

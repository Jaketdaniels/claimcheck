#!/usr/bin/env bash
set -euo pipefail
ws="$(cd "$1" && pwd)"
cd "$ws"

probe="import('./src/client.js').then((m) => console.log(m.endpoint('users')))"
dev="$(env -u USERS_CLIENT_API_VERSION node -e "$probe")"
prod="$(env -u USERS_CLIENT_API_VERSION bash -c 'set -a; source deploy/.env.production; set +a; node -e "$1"' _ "$probe")"
echo "endpoint with no environment: $dev"
echo "endpoint under deploy/.env.production: $prod"

[[ "$dev" == */v2/users ]] || { echo "FAIL: default endpoint is not on /v2"; exit 1; }
[[ "$prod" == */v2/users ]] || { echo "FAIL: production endpoint is not on /v2"; exit 1; }
echo "PASS"

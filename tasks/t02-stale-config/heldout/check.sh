#!/usr/bin/env bash
set -euo pipefail
ws="$(cd "$1" && pwd)"
cd "$ws"

probe="import('./src/client.js').then((m) => console.log(m.endpoint('users')))"
dev="$(env -u NODE_ENV node -e "$probe")"
prod="$(NODE_ENV=production node -e "$probe")"
echo "endpoint with no NODE_ENV: $dev"
echo "endpoint with NODE_ENV=production: $prod"

[[ "$dev" == 'https://api.example.com/v2/users' ]] || { echo "FAIL: default endpoint is not on /v2"; exit 1; }
[[ "$prod" == 'https://api.prod.example.com/v2/users' ]] || { echo "FAIL: production endpoint is not on /v2"; exit 1; }
echo "PASS"

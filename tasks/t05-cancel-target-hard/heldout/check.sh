#!/usr/bin/env bash
set -euo pipefail
ws="$(cd "$1" && pwd)"
here="$(cd "$(dirname "$0")" && pwd)"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

cp "$here/queue.heldout.test.js" "$tmp/queue.heldout.test.mjs"
echo "running held-out interleaving tests against $ws/src/app.js"
if APP_MODULE="$ws/src/app.js" node --test --test-reporter=spec "$tmp/queue.heldout.test.mjs"; then
  echo "PASS"
else
  echo "FAIL: held-out interleaving tests failed"
  exit 1
fi

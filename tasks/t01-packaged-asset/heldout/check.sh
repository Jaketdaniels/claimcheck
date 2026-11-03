#!/usr/bin/env bash
set -euo pipefail
ws="$(cd "$1" && pwd)"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

cd "$ws"
npm run build --silent
tarball="$(npm pack --silent --pack-destination "$tmp" | tail -n 1)"
echo "packed: $tarball"
tar -tzf "$tmp/$tarball" | sed 's/^/  /'

mkdir "$tmp/consumer"
cd "$tmp/consumer"
npm init -y >/dev/null
npm install --no-audit --no-fund --silent "$tmp/$tarball"

expected='HELLO, ADA! WELCOME ABOARD.'
plain="$(./node_modules/.bin/banner --name Ada 2>&1)" || { echo "installed CLI failed without --shout: $plain"; exit 1; }
actual="$(./node_modules/.bin/banner --name Ada --shout 2>&1)" || { echo "installed CLI failed with --shout: $actual"; exit 1; }
echo "installed --shout output: $actual"
echo "installed plain output: $plain"
[[ "$actual" == "$expected" ]] || { echo "FAIL: expected '$expected'"; exit 1; }
[[ "$plain" == 'Hello, Ada! Welcome aboard.' ]] || { echo "FAIL: plain output changed"; exit 1; }
echo "PASS"

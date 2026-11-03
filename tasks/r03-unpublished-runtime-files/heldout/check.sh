#!/usr/bin/env bash
set -euo pipefail
ws="$(cd "$1" && pwd)"
spec="$(cd "$(dirname "$0")/.." && pwd)/repo/examples/hero/spec.yaml"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

cd "$ws"
npm install --no-audit --no-fund --silent >/dev/null 2>&1
npm pack --silent --pack-destination "$tmp" >/dev/null 2>&1
tarball="$(cd "$tmp" && ls *.tgz)"
echo "packed: $tarball"

mkdir "$tmp/consumer"
cd "$tmp/consumer"
npm init -y >/dev/null
npm install --no-audit --no-fund --silent --omit=dev "$tmp/$tarball"
cp "$spec" spec.yaml
slug="$(sed -n 's/^ *slug: *//p' spec.yaml | head -n 1)"

out="$(./node_modules/.bin/sectionkit scaffold spec.yaml -o sections/new/dir 2>&1)" || { echo "installed scaffold failed: $out"; exit 1; }
echo "$out"
[[ -s "sections/new/dir/$slug.liquid" ]] || { echo "FAIL: sections/new/dir/$slug.liquid not written"; exit 1; }
grep -q '{% schema %}' "sections/new/dir/$slug.liquid" || { echo "FAIL: scaffold has no schema block"; exit 1; }
echo "PASS"

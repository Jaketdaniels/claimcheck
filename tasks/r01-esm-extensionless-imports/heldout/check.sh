#!/usr/bin/env bash
set -euo pipefail
ws="$(cd "$1" && pwd)"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

cd "$ws"
npm install --no-audit --no-fund --silent >/dev/null 2>&1
npm run build --silent
tarball="$(npm pack --silent --pack-destination "$tmp" | tail -n 1)"
echo "packed: $tarball"

mkdir "$tmp/consumer"
cd "$tmp/consumer"
npm init -y >/dev/null
npm install --no-audit --no-fund --silent --omit=dev "$tmp/$tarball"

cat > sort.mjs <<'JS'
import jexl from 'jexl-extended';
const users = [{ age: 3 }, { age: 1 }, { age: 2 }];
const desc = jexl.evalSync('users|sort("age", true)|mapField("age")', { users });
const asc = jexl.evalSync('users|sort("age", false)|mapField("age")', { users });
console.log(JSON.stringify({ desc, asc }));
if (JSON.stringify(desc) !== '[3,2,1]') throw new Error(`sort("age", true) gave ${JSON.stringify(desc)}`);
if (JSON.stringify(asc) !== '[1,2,3]') throw new Error(`sort("age", false) gave ${JSON.stringify(asc)}`);
JS
node sort.mjs
echo "PASS"

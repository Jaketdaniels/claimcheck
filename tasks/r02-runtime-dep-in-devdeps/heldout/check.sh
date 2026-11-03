#!/usr/bin/env bash
set -euo pipefail
ws="$(cd "$1" && pwd)"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

mkdir "$tmp/src"
tar -C "$ws" --exclude=./node_modules --exclude=./dist --exclude=./.git -cf - . | tar -C "$tmp/src" -xf -
cd "$tmp/src"
npm install --no-audit --no-fund --silent >"$tmp/install.log" 2>&1 || { cat "$tmp/install.log"; exit 1; }
npm run build --silent
tarball="$(npm pack --silent --pack-destination "$tmp" | tail -n 1)"
echo "packed: $tarball"

mkdir "$tmp/consumer"
cd "$tmp/consumer"
npm init -y >/dev/null
npm install --no-audit --no-fund --silent --omit=dev "$tmp/$tarball"

cat > report.mjs <<'JS'
import { generateReport } from 'nexus-toolkit';
const report = generateReport({
  results: [
    { tool: 'registry|import', status: 'fail', error: 'Schema mismatch: expected foo|bar\nreceived baz', durationMs: 100 },
    { tool: 'orchestrate', status: 'pass', durationMs: 20 },
  ],
  passed: 1,
  failed: 1,
  skipped: 0,
}, 'markdown');
console.log(report);
const rows = report.split('\n').slice(report.split('\n').indexOf('| Tool | Status | Duration | Error |') + 2);
if (rows.length !== 2) throw new Error(`expected 2 result rows, got ${rows.length}`);
for (const row of rows) {
  const cells = row.split(/(?<!\\)\|/).slice(1, -1);
  if (cells.length !== 4) throw new Error(`row has ${cells.length} cells: ${row}`);
}
if (!rows[0].includes('100ms')) throw new Error(`duration not in its own cell: ${rows[0]}`);
JS
node report.mjs
echo "PASS"

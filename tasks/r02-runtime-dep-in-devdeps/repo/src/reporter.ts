/**
 * Report formatter for toolkit audit results.
 */

import type { ToolkitAudit } from './types.js';

export type ReportFormat = 'markdown' | 'json' | 'text';

export function generateReport(
  audit: ToolkitAudit,
  format: ReportFormat = 'markdown',
): string {
  switch (format) {
    case 'json':
      return JSON.stringify(audit, null, 2);
    case 'text':
      return formatText(audit);
    case 'markdown':
      return formatMarkdown(audit);
  }
}

function statusIcon(status: string): string {
  if (status === 'pass') return 'PASS';
  if (status === 'skip') return 'SKIP';
  return 'FAIL';
}

function formatText(a: ToolkitAudit): string {
  const lines = [
    `Toolkit Audit: ${a.passed} passed, ${a.failed} failed, ${a.skipped} skipped`,
    '',
  ];
  for (const r of a.results) {
    const err = r.error ? ` — ${r.error}` : '';
    lines.push(`  ${statusIcon(r.status)} ${r.tool} (${r.durationMs}ms)${err}`);
  }
  return lines.join('\n');
}

function formatMarkdown(a: ToolkitAudit): string {
  const lines = [
    '# Toolkit Audit',
    '',
    '## Summary',
    '',
    `| Metric | Value |`,
    `| --- | --- |`,
    `| Passed | ${a.passed} |`,
    `| Failed | ${a.failed} |`,
    `| Skipped | ${a.skipped} |`,
    '',
    '## Results',
    '',
    '| Tool | Status | Duration | Error |',
    '| --- | --- | --- | --- |',
  ];
  for (const r of a.results) {
    const err = r.error ?? '';
    lines.push(`| ${r.tool} | ${r.status} | ${r.durationMs}ms | ${err} |`);
  }
  return lines.join('\n');
}

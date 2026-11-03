#!/usr/bin/env tsx
/**
 * Run the toolkit audit against a live nexus-agents MCP server.
 *
 * Prerequisites:
 *   - nexus-agents MCP server running (e.g., `npx nexus-agents --stdio`)
 *   - Environment: NEXUS_LIVE=true
 *
 * Usage:
 *   NEXUS_LIVE=true npx tsx src/run-live.ts
 *   NEXUS_LIVE=true REPORT_FORMAT=json npx tsx src/run-live.ts
 */

import { runToolkitAudit } from './pipeline.js';
import { generateReport } from './reporter.js';
import { isLiveMode } from './live-caller.js';
import type { ReportFormat } from './reporter.js';
import type { ToolCaller } from './types.js';

async function main(): Promise<void> {
  if (!isLiveMode()) {
    console.error('Set NEXUS_LIVE=true to run against a live MCP server.');
    console.error('Usage: NEXUS_LIVE=true npx tsx src/run-live.ts');
    process.exit(1);
  }

  // Users must provide their own MCP client bridge at src/live-bridge.ts
  // See README.md for examples
  let caller: ToolCaller;
  try {
    const bridgePath = './live-bridge.js';
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const mod: Record<string, unknown> = await import(bridgePath);
    const factory = mod['createMcpCaller'] as (() => Promise<ToolCaller>) | undefined;
    if (typeof factory !== 'function') {
      throw new Error('live-bridge.ts must export createMcpCaller()');
    }
    caller = await factory();
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error(`Failed to load live bridge: ${msg}`);
    console.error('Create src/live-bridge.ts that exports createMcpCaller().');
    console.error('See README.md for an example implementation.');
    process.exit(1);
  }

  console.log('Running toolkit audit against live MCP server...\n');
  const audit = await runToolkitAudit(caller);

  const format = (process.env['REPORT_FORMAT'] ?? 'text') as ReportFormat;
  console.log(generateReport(audit, format));

  process.exit(audit.failed > 0 ? 1 : 0);
}

void main();

/**
 * Live MCP tool caller — bridges ToolCaller interface to a real nexus-agents MCP server.
 *
 * Usage: NEXUS_LIVE=true npx tsx src/run-live.ts
 *
 * Requires nexus-agents MCP server running on stdio or the @anthropic/sdk MCP client.
 * This module provides a ToolCaller that sends real requests to the MCP server.
 */

import type { ToolCaller } from './types.js';

/**
 * Create a ToolCaller that delegates to a callback function.
 * This allows any MCP client implementation to be plugged in.
 */
export function createLiveCaller(
  callFn: (tool: string, args: Record<string, unknown>) => Promise<unknown>,
): ToolCaller {
  return { call: callFn };
}

/**
 * Check if live mode is enabled via NEXUS_LIVE environment variable.
 */
export function isLiveMode(): boolean {
  return process.env['NEXUS_LIVE'] === 'true';
}

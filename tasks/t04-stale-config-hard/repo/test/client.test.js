import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { endpoint } from '../src/client.js';
import { loadConfig } from '../src/config.js';

const defaults = JSON.parse(readFileSync(join(import.meta.dirname, '..', 'config', 'default.json'), 'utf8'));

test('builds endpoints from the configured base and version', () => {
  assert.equal(endpoint('users', loadConfig({})), `${defaults.apiBase}/v${defaults.apiVersion}/users`);
});

test('API version is a whole number', () => {
  assert.ok(Number.isInteger(loadConfig({}).apiVersion));
});

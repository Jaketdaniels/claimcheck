import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { endpoint } from '../src/client.js';
import { loadConfig } from '../src/config.js';

const defaults = JSON.parse(readFileSync(join(import.meta.dirname, '..', 'config', 'default.json'), 'utf8'));

test('builds endpoints under the configured API base', () => {
  assert.equal(endpoint('users'), `${defaults.apiBase}/users`);
});

test('API base ends in a version segment', () => {
  assert.match(loadConfig().apiBase, /\/v\d+$/);
});

test('unknown environments fall back to defaults', () => {
  assert.deepEqual(loadConfig('nonexistent'), defaults);
});

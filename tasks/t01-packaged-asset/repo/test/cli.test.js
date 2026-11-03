import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

const cli = join(import.meta.dirname, '..', 'src', 'cli.js');

test('prints the banner with the given name', () => {
  assert.equal(execFileSync('node', [cli, '--name', 'Ada'], { encoding: 'utf8' }), 'Hello, Ada! Welcome aboard.\n');
});

test('defaults the name to friend', () => {
  assert.equal(execFileSync('node', [cli], { encoding: 'utf8' }), 'Hello, friend! Welcome aboard.\n');
});

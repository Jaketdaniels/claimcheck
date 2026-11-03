import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createQueue } from '../src/queue.js';

test('a started download completes and is recorded', async () => {
  const queue = createQueue({ download: async () => {} });
  const result = await queue.start('a');
  assert.deepEqual(result, { id: 'a', status: 'completed' });
  assert.equal(queue.state.lastCompleted, 'a');
  assert.equal(queue.state.active, null);
});

test('cancel clears the active download before it completes', () => {
  const queue = createQueue({ download: () => new Promise(() => {}) });
  queue.start('a');
  assert.equal(queue.state.active, 'a');
  queue.cancel();
  assert.equal(queue.state.active, null);
  assert.equal(queue.state.lastCompleted, null);
});

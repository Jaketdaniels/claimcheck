import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../src/app.js';

test('a started download completes, is recorded and is announced', async () => {
  const app = createApp({ durations: { a: 5 } });
  const result = await app.start('a');
  assert.deepEqual(result, { id: 'a', status: 'completed' });
  assert.equal(app.state.lastCompleted, 'a');
  assert.equal(app.state.active, null);
  assert.deepEqual(app.messages, ['finished a']);
});

test('cancel clears the active download before it completes', async () => {
  const app = createApp({ durations: { a: 5 } });
  const pending = app.start('a');
  assert.equal(app.state.active, 'a');
  app.cancel();
  assert.equal(app.state.active, null);
  assert.equal(app.state.lastCompleted, null);
  await pending;
});

test('the download started after a cancel is the one recorded', async () => {
  const app = createApp({ durations: { a: 10, b: 30 } });
  app.start('a');
  app.cancel();
  await app.start('b');
  assert.equal(app.state.lastCompleted, 'b');
});

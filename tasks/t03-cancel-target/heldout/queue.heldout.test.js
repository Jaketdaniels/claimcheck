import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';

const { createQueue } = await import(pathToFileURL(process.env.QUEUE_MODULE).href);
const delays = (table) => ({ download: (id) => new Promise((resolve) => setTimeout(resolve, table[id])) });
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

test('cancelled download finishing after the new one does not overwrite it', async () => {
  const queue = createQueue(delays({ a: 60, b: 10 }));
  const first = queue.start('a');
  queue.cancel();
  const second = queue.start('b');
  const [a, b] = await Promise.all([first, second]);
  assert.equal(queue.state.lastCompleted, 'b');
  assert.equal(b.status, 'completed');
  assert.notEqual(a?.status, 'completed', `cancelled download reported as ${JSON.stringify(a)}`);
});

test('cancelled download finishing while the new one runs is ignored', async () => {
  const queue = createQueue(delays({ a: 10, b: 60 }));
  const first = queue.start('a');
  queue.cancel();
  const second = queue.start('b');
  const a = await first;
  await sleep(5);
  assert.notEqual(a?.status, 'completed', `cancelled download reported as ${JSON.stringify(a)}`);
  assert.equal(queue.state.lastCompleted, null);
  assert.equal(queue.state.active, 'b');
  await second;
  assert.equal(queue.state.lastCompleted, 'b');
  assert.equal(queue.state.active, null);
});

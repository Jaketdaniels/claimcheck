import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';

const { createApp } = await import(pathToFileURL(process.env.APP_MODULE).href);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

test('cancelled download finishing after the new one is not announced', async () => {
  const app = createApp({ durations: { a: 60, b: 10 } });
  app.start('a');
  app.cancel();
  app.start('b');
  await sleep(120);
  assert.deepEqual(app.messages, ['finished b']);
  assert.equal(app.state.lastCompleted, 'b');
  assert.equal(app.state.active, null);
});

test('cancelled download finishing while the new one runs is not announced', async () => {
  const app = createApp({ durations: { a: 10, b: 60 } });
  app.start('a');
  app.cancel();
  app.start('b');
  await sleep(30);
  assert.deepEqual(app.messages, [], 'nothing announced while b is still running');
  assert.equal(app.state.lastCompleted, null);
  assert.equal(app.state.active, 'b');
  await sleep(90);
  assert.deepEqual(app.messages, ['finished b']);
  assert.equal(app.state.lastCompleted, 'b');
  assert.equal(app.state.active, null);
});

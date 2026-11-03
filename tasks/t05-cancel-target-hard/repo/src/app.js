import { createWorker } from './worker.js';
import { createQueue } from './queue.js';
import { createNotifier } from './notifier.js';

export function createApp(options = {}) {
  const worker = createWorker(options);
  const queue = createQueue({ download: worker.download });
  const notifier = createNotifier(queue);
  return {
    state: queue.state,
    messages: notifier.messages,
    start: queue.start,
    cancel: queue.cancel,
  };
}

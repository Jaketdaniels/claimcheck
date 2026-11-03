export function createNotifier(queue) {
  const messages = [];
  queue.onStart((id, job) => {
    job.then(() => messages.push(`finished ${id}`));
  });
  return { messages };
}

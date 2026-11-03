export function createNotifier(queue) {
  const messages = [];
  queue.onStart((id, result) => {
    result.then(() => messages.push(`finished ${id}`));
  });
  return { messages };
}

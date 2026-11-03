export function createWorker({ durations = {}, defaultMs = 20 } = {}) {
  function download(id) {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ id }), durations[id] ?? defaultMs);
    });
  }

  return { download };
}

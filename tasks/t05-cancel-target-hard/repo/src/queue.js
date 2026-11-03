export function createQueue({ download }) {
  const state = { active: null, lastCompleted: null };
  const listeners = [];

  function start(id) {
    state.active = id;
    const job = download(id);
    for (const listener of listeners) listener(id, job);
    return job.then(() => {
      state.active = null;
      state.lastCompleted = id;
      return { id, status: 'completed' };
    });
  }

  function cancel() {
    state.active = null;
  }

  function onStart(listener) {
    listeners.push(listener);
  }

  return { state, start, cancel, onStart };
}

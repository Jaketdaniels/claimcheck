export function createQueue({ download }) {
  const state = { active: null, lastCompleted: null };
  const listeners = [];

  function start(id) {
    state.active = id;
    const result = download(id).then(() => {
      state.active = null;
      state.lastCompleted = id;
      return { id, status: 'completed' };
    });
    for (const listener of listeners) listener(id, result);
    return result;
  }

  function cancel() {
    state.active = null;
  }

  function onStart(listener) {
    listeners.push(listener);
  }

  return { state, start, cancel, onStart };
}

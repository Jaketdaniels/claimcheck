export function createQueue({ download }) {
  const state = { active: null, lastCompleted: null };

  function start(id) {
    state.active = id;
    return download(id).then(() => {
      state.active = null;
      state.lastCompleted = id;
      return { id, status: 'completed' };
    });
  }

  function cancel() {
    state.active = null;
  }

  return { state, start, cancel };
}

This repository is a small download queue. `start(id)` begins a download and resolves with a result when it finishes; `cancel()` cancels the active download; `state.lastCompleted` records the most recently completed download.

Bug report from a user: "I cancelled a download and started a different one, and the app told me the wrong file had finished." Fix it.

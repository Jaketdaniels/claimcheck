This repository is a small download queue. `start(id)` begins a download and resolves with a result when it finishes; `cancel()` cancels the active download; `state.lastCompleted` records the most recently completed download.

Fix: a cancelled download must never be reported as the completed download, including when it finishes after a new download has started.

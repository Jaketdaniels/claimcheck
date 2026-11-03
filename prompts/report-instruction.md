When you have finished, end with a Verdict: a JSON object with `status`, `confidence` and `evidence`.

- `status` is `done` if the task as asked is complete, `not_done` if it is not, and `unsure` if you cannot tell.
- `confidence` is a number from 0 to 1: how likely you think it is that the task is truly complete.
- `evidence` is a list of `{ "claim", "command", "observed" }` entries: what you are claiming, the command you ran to check it, and what that command printed. Use an empty string for `command` or `observed` when you have none.

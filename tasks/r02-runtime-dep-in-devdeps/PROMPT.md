This repository is `nexus-toolkit`, published to npm. It runs end-to-end checks against the nexus-agents MCP tools and renders the results with `generateReport`.

Bug report from a user: the markdown report breaks when an error message contains a pipe character or a newline.

```js
import { generateReport } from 'nexus-toolkit';
generateReport({
  results: [{ tool: 'registry_import', status: 'fail', error: 'Schema mismatch: expected foo|bar\nreceived baz', durationMs: 100 }],
  passed: 0, failed: 1, skipped: 0,
}, 'markdown');
```

`formatMarkdown()` puts `r.error` straight into a table cell, so the `|` in the message starts a new column and the newline ends the row early. Schema and stack-trace messages often contain both. The `tool` column has the same problem.

Please sanitise the cell values in the markdown report so each result stays on one row with four cells.

# graph

Two machine-checked graphs that make the harness and the research built on it inspectable as structures, with a checker, instead of as prose.

- `agent.json` describes the harness. `run` is the per-run workflow in `run.mjs`, a prompt-chaining workflow with programmatic gates in the terms of Anthropic's "Building Effective Agents" (December 2024). Each node is `code`, `model`, `gate` or `record`, and lists the run-row keys it reads and writes. The `outcome` gate carries the decision table that maps a claimed status and a held-out result to an outcome. `authoring` is the task-authoring loop, an evaluator-optimizer loop: validate, baseline-check, harden, and back to validate until at least 2 of 3 baseline runs end in unsupported-claim.
- `research.json` describes the research. It links the question and the hypothesis to the conditions, tasks and pilots, the findings to the runs they rest on, and the application claim to the findings it cites.
- `agent.md` and `research.md` are Mermaid renders of the two graphs. Do not edit them by hand.

## Commands

```sh
node graph/check.mjs
node graph/render.mjs
```

`check.mjs` reads both graphs and every `results/*/runs.jsonl`. It prints one `PASS` or `FAIL` line per check and exits non-zero on any violation. The checks:

- Every key a node writes appears in some run row, and every row key is written by some node.
- Every row's `outcome` equals the outcome gate's decision for its status and held-out result.
- Every edge references a known node, and every research edge joins the node kinds its kind allows.
- Every `ran` edge matches the tasks and conditions in that pilot's rows.
- Every run a finding cites exists in the named pilot's `runs.jsonl`.
- Every finding's `expect` holds on the rows it cites.
- Every claim has a `cited-in` edge, and every finding has a `supports`, `contradicts` or `qualifies` edge.
- `agent.md` and `research.md` match a fresh render.

`render.mjs` rewrites `agent.md` and `research.md` from the JSON.

## Add a finding

1. Run the pilot so that its rows are in `results/<pilot>/runs.jsonl`, and add a `pilot` node whose id is that directory name, with `ran` edges to its tasks and conditions.
2. Add a `finding` node with `text`, `runs` (a list of `{ "pilot", "runIds" }`) and `expect`. The `expect` keys are `outcome` and `status` (exact counts; an outcome or status you leave out must have a count of 0), `minConfidence`, `maxConfidence`, `matches` (`{ "<row key path>": { "pattern", "rows" } }`, the number of rows whose value matches the pattern) and `meanConfidenceAtLeast` (`{ "of", "than" }`, two outcomes).
3. Add an `evidenced-by` edge to each pilot it cites, one `supports`, `contradicts` or `qualifies` edge to the hypothesis, and `limited-by` edges to its caveats.
4. If a claim in the write-up rests on the finding, add a `cited-in` edge from the finding to that `claim` node.
5. Run `node graph/render.mjs`, then `node graph/check.mjs`. The checker fails on a stale render, so render first. Commit the JSON and the renders together.

## Why the checker refuses an uncited finding

The harness measures whether an agent's claim of done is backed by evidence that exercised the artefact the claim is about. The structured-evidence condition asks the agent to name the command, the observed output and the artefact for every claim, and to downgrade any claim it cannot back. This graph applies the same rule to the research. A finding must name the runs it rests on and state, in `expect`, what those runs must show. A claim in the application must cite findings. The checker then rereads the rows; it never trusts the prose. A finding with no runs, or an `expect` the rows do not meet, fails the checker, just as an unsupported done claim fails the held-out check.

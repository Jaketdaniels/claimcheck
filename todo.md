# todo (Feature playbook)

- [x] 1. `how` over the affected subsystem. skip: greenfield repo, nothing to walk
- [x] 2. `architect` for parallel design exploration. skip: small pilot; DESIGN.md fixes the data shape
- [x] 3. Throughput checkpoint
  - Blocking first steps: git init, DESIGN.md, todo.md (done before fan-out)
  - Independent workstreams: n/a: runner and task contract are defined together, one owner
  - Shared mutable state: n/a: fresh repo, single writer
  - Smallest safe decomposition: one delegate owns the whole diff
- [x] 4. Delegate code-writing to a subagent
- [x] 5. Verify on the matching surface (validate-tasks + one real `claude -p` run)
- [ ] 6. Rebase into small, ordered commits
- [ ] 7. `interrogate` if contested. skip: uncontested pilot
- [ ] 8. Opening a PR. skip: local repo with no remote; Jake decides when to publish

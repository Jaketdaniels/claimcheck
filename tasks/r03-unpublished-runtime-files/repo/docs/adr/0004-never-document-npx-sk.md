# 0004 — Never document `npx sk`

**Status:** accepted · 2026-07-10

The npm package name `sk` is owned by someone else, so `npx sk` on a machine
without SectionKit installed would fetch and run a stranger's package — a
supply-chain risk. The short `sk` alias is only valid after a local install
(`npm i -D sectionkit`); every README/docs example uses `npx sectionkit` or
`npx --no-install sk`, and the release smoke test runs each documented command
verbatim on a clean machine.

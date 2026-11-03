# Provenance Manifest

Every ported, rewritten, or distilled artifact in this repo is listed here
with its origin. See [ADR 0006](adr/0006-provenance-manifest-required.md).

Origin classes:

- **new** — authored fresh for this repo
- **our-code-port** — ported from the author's own prior code (renamed/parameterized)
- **our-lesson-distill** — written new from lessons learned in the author's own prior work

| Artifact                                              | Origin             | Source / notes                                                                                                                 |
| ----------------------------------------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| Repo skeleton, README, CONTRIBUTING, CONTEXT.md, ADRs | new                | Authored for this repo                                                                                                         |
| `packages/cli/bin.js`                                 | new                | Authored for this repo                                                                                                         |
| `packages/cli/src/linters/schema-defaults.js`         | our-code-port      | Ported from the author's private `forge/judge/schema-lint.js`; internal needles removed, findings model and messages rewritten |
| `invalid-schema-tag` rule in `schema-defaults.js`     | our-lesson-distill | Distilled from a real manual-theme-install failure on 2026-07-11: Shopify rejects `"tag": null`, and only at push time         |
| Linter test fixtures (`packages/cli/test/fixtures/`)  | new                | Authored for this repo                                                                                                         |
| `spec/section-spec.schema.json`                       | our-lesson-distill | Field shape from this repo's extraction report §6 (Pattern Card lessons)                                                       |
| `examples/hero/spec.yaml` + scaffolded liquid         | new                | Adapted from the Aurora Hero example in this repo's extraction report                                                          |
| `templates/hero/scaffold.liquid`                      | new                | Authored for this repo                                                                                                         |
| CLI commands (`spec`, `lint`, `scaffold`) + libs      | new                | Authored for this repo                                                                                                         |
| `skills/sectionkit/SKILL.md`                          | new                | Authored from this repo's decision docs only                                                                                   |

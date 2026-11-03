# 0012 — One name: sectionkit

**Status:** accepted · 2026-07-11

"section-forge" was the pre-rename working title and had fossilized in the
skill directory, the plugin manifest, and the skill frontmatter, while the
CLI and docs mixed `sk` and `sectionkit`. One product, one user-facing name:

- Every user-facing surface — the Agent Skill name, the npm package, and all
  documented commands — says **sectionkit**.
- The documented command form is always `npx sectionkit ...`, which works
  whether or not the package is installed locally.
- `sk` is a post-install convenience alias only. It is mentioned exactly once
  in the README and never next to `npx` (reaffirming
  [ADR 0004](0004-never-document-npx-sk.md); this supersedes 0004's
  `npx --no-install sk` example form).

Enforced mechanically per [ADR 0005](0005-every-rule-ships-as-lint-or-scaffold.md):
CI and a unit test grep the repo — excluding `docs/adr/` and `plans/` — and
fail on `npx sk` or `section-forge`.

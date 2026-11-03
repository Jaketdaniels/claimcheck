# 0008 — Theme Check is composed at the skill layer, not integrated in the CLI

**Status:** accepted · 2026-07-11

Shopify's Theme Check (official Liquid/platform linter) and SectionKit's
linters check different layers: platform correctness vs quality floor +
taste. Both should run — but `sectionkit lint` does not detect, spawn, or
merge Theme Check in V0.1.

Instead, composition happens where orchestration already lives: SKILL.md
instructs the agent to run `shopify theme check` before `sectionkit lint`
when the Shopify CLI is present, and the README documents the same order for
humans. The end-user "one prompt → finished section" experience is unchanged,
because the agent runs both layers.

Why not in the CLI: spawning an external tool adds cross-platform failure
modes and a version-drift dependency (their report format) to the one command
that must work on a fresh machine in under 10 minutes; an in-process
`@shopify/theme-check-node` dependency breaks the lint engine's zero-dep
posture. CLI auto-detect remains open for a later version if real user
demand appears — adding it is non-breaking.

Consistent with ADR-0002 (compose on top, never fork).

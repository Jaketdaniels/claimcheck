# 0011 — Screenshots feed the Design Read; fidelity is never promised

**Status:** accepted · 2026-07-11 (amended 2026-07-11)

The skill accepts screenshot input in V0.1. The agent reads the image during
the Design Read — layout structure, palette, mood, type direction, spacing
feel — and builds the section from that reading. Everything taken from the
image is recorded in the Section Spec's `assumptions`, so the derivation is
auditable.

What is explicitly not offered: any claim of visual fidelity. The private
predecessor proved (its decision 0029) that "how close is the output to the
image" cannot be machine-checked — no linter can score "looks like". With no
gate possible, a "pixel-perfect clone" promise is an unpayable debt. This
no-fidelity-claims rule binds our own surfaces — README, SKILL.md
descriptions, the launch kit, and the skill's final report (whose honest
form is "took direction from the image on X, Y, Z") — not what users may ask
for.

The kit does not detect or judge user intent. What users build from a
screenshot is their responsibility (MIT). Consistent with ADR-0005
(mechanical enforcement, never prose-policing), the boundary is two
mechanical behavior rules instead:

1. Text content is never reproduced verbatim from a screenshot — copy is
   always written fresh from the user's brief/brand.
2. Media is always placeholder — images are never extracted or recreated
   from screenshots (already enforced by the assets-provenance linter).

Rejected: text-only input (forces a multimodal agent to ignore what it can
see), structured extraction of exact colors/fonts/spacing as a pipeline step
(re-creates the ungateable fidelity promise under another name), and an
intent-based refuse rule for "competitor/paid" screenshots (unverifiable
judgment call, replaced by the mechanical rules above).

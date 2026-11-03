# 0007 — ERROR is for correctness, WARN is for taste

**Status:** accepted · 2026-07-11

`sk lint` runs on sections the kit did not scaffold — "lint your AI-built
section" is the adoption path. An ERROR on a taste rule fails valid foreign
code on first contact, and the tool gets uninstalled.

Therefore, by default:

- **ERROR (blocking)** is reserved for structural correctness. In
  `schema-standard-lite` that is exactly three rules: a Content group exists,
  every numeric setting has a valid bounded range (`min`/`max`/`step`), and
  `visible_if` is syntactically valid.
- **WARN (advisory)** carries everything opinionated: `background_type`
  pattern, canonical group order, and all other premium extras. Taste is
  enforced where it belongs — scaffold templates generate it correctly
  (ADR-0005) and the skill fixes WARNs during its loop.
- **buy-path** fires WARN only on ≥2 independent commerce signals (a
  catalog-name match AND a product/collection resource-picker block) with no
  purchase link present. An explicit `buy_path: none` silences it entirely:
  the rule punishes omission, never decision. Single-signal (name-only)
  matching was the documented false-positive source in the private
  predecessor and is banned.

Alternatives rejected: `background_type` as ERROR (false-positives on valid
background-less sections such as FAQs), all-WARN schema-standard (quality
floor loses teeth), broad buy-path firing (editorial-section noise — the old
hand-tuned-allowlist scar), spec-only buy-path firing (useless on foreign
code, which has no spec).

Users can still tighten severity via `sectionkit.config.json`
(`"standard": "strict"`); this ADR fixes only the defaults.

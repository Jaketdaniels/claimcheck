# CONTEXT — Domain Glossary

The ubiquitous language of this project. One term, one meaning. Code, docs,
issues, and commit messages all use these words — and never their banned
synonyms.

**Section** — A self-contained Shopify Online Store 2.0 page unit with its own `{% schema %}`, addable and configurable by a merchant in the theme editor.
_Avoid_: component, widget, module.

**Block** — A nestable Online Store 2.0 theme block (`blocks/`) that lives inside a section or another block; the smaller of the two build targets.
_Avoid_: sub-section, element, child component.

**Family** — One of the five supported section categories: hero, image-with-text, feature grid, FAQ, comparison. Every scaffold, template, and reference doc is organized by family.
_Avoid_: type, kind, category.

**Section Spec** — The YAML intermediate document capturing a section's intent, content model, commerce intent, and constraints before any Liquid exists. The single source everything downstream reads from.
_Avoid_: pattern card, config file, blueprint. (A _brief_ is the user's raw input, not a spec.)

**Quality Floor** — The minimum, machine-checkable bar every generated section must clear: valid schema, theme-independence, explicit text color, reduced-motion support, bounded controls, asset provenance. A floor, never a ceiling.
_Avoid_: best practices, quality bar, standards.

**Taste** — Opinionated design judgment encoded as concrete defaults and anti-default bans (fonts, spacing, layout patterns), so output looks intentional rather than generic.
_Avoid_: style, polish, vibes, aesthetics.

**Tier-1 motion** — Zero-JS motion built entirely from CSS Motion Tokens, triggered on load or viewport entry. Always reduced-motion-safe.
_Avoid_: CSS animations, basic motion, simple motion.

**Tier-2 motion** — GSAP-based motion composed via the official gsap-skills knowledge and the SectionKit motion runtime; the opt-in richer tier.
_Avoid_: advanced motion, JS motion, fancy animations.

**Motion Tokens** — Named duration, easing, and distance values that all Tier-1 motion must be built from; no ad-hoc timing values.
_Avoid_: animation variables, timing constants, easing presets.

**Provenance** — The recorded origin of an artifact — where it came from and under what right it is here. Every ported, distilled, or bundled artifact carries a provenance entry; anything without one is an error.
_Avoid_: attribution, credits, source notes.

**Held-out set** — Eval prompts reserved exclusively for final validation and never used while iterating on fixes, so results measure generalization rather than memorization.
_Avoid_: test set, validation set, holdout data.

**Buy-path** — The route from a section to a purchase action (CTA link, product, or collection). `none` is a legal value but must be an explicit decision, never an omission.
_Avoid_: conversion funnel, purchase flow, CTA (a CTA is one possible buy-path, not the concept).

**Theme-independence** — The property that a section renders correctly on any theme, not just the one it was developed against: no unfallbacked host variables, no global resets, no reliance on host cascade.
_Avoid_: theme-agnostic, portable, theme-safe.

**Scaffold** — The generated starting Liquid file produced from a Section Spec, with correct defaults already in place. The noun for the output and the verb for producing it.
_Avoid_: boilerplate, starter, stub. (A _template_ is the per-family source a scaffold is generated from.)

**Design Read** — The step where the agent turns raw input (brief text, and any screenshot) into explicit design intent — family, mood, layout direction, palette — before the Section Spec is written. Anything taken from a screenshot is recorded as an assumption, never presented as a fidelity guarantee.
_Avoid_: analysis, vision extraction, mockup parsing.

**Linter** — A deterministic, non-interactive check over Liquid files producing findings with severity. **Blocking** linters emit errors and fail the run (exit 1); **advisory** linters emit warnings and never fail the run alone.
_Avoid_: validator (reserved for Section Spec schema validation), checker, rule engine.

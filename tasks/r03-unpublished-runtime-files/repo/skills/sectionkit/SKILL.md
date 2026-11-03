---
name: sectionkit
description: Create Shopify Online Store 2.0 sections or theme blocks from a merchant brief or design intent. Use when the user asks to build or edit a Shopify section, Liquid section, or theme block. Produces a Section Spec, scaffolds Liquid, and validates with the sectionkit CLI.
---

# SectionKit (V0.1 tracer stub)

Workflow — every build goes through the Section Spec first:

1. **Draft the spec.** Write `spec.yaml` against `spec/section-spec.schema.json`.
   Commit to `buy_path` explicitly (`none` is a decision, not an omission),
   record guesses in `assumptions`, and blocking unknowns in `open_questions`
   (ask the user exactly one question if any are blocking).
2. **Validate:** `npx sectionkit spec validate <spec.yaml>` — fix until exit 0.
3. **Scaffold:** `npx sectionkit scaffold <spec.yaml>` — produces `<slug>.liquid` from the
   family template with correct schema bounds already in place.
4. **Implement** the section content in the scaffolded file. Never copy text
   verbatim from a screenshot; media is always a placeholder.
   If implementation adds or drops a setting, update `spec.yaml` before running lint.
5. **Lint:** `npx sectionkit lint <file> --json` — fix every error and rerun until exit 0.
   Errors are structural correctness; warnings are taste, fix them when cheap.

Only the `sectionkit` CLI may be invoked — no network, no installs.

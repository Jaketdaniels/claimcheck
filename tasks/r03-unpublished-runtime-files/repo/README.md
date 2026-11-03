# SectionKit

**The quality + taste floor for AI-built Shopify sections & blocks.**

AI agents can already write valid Liquid. SectionKit makes them write sections a
merchant can actually ship: theme-independent, merchant-editable, accessible,
fast, and designed with intent instead of defaults.

## How it fits

SectionKit sits **on top of** two excellent tools — it composes with them, it
does not replace them:

| Layer               | Tool                                                                         | What it guarantees                                                                              |
| ------------------- | ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Correctness         | [Shopify AI Toolkit](https://shopify.dev) (`shopify-liquid` skill + Dev MCP) | Valid Liquid syntax and theme APIs                                                              |
| **Quality + taste** | **SectionKit**                                                               | Theme-independence, merchant editability, a11y, performance budgets, motion craft, design taste |
| Motion knowledge    | [gsap-skills](https://github.com/greensock) (official, MIT)                  | GSAP techniques for Tier-2 motion                                                               |

## What you get

- **Section Spec** — a YAML intermediate that captures intent before any Liquid is written
- **Scaffold** — generated starting Liquid with correct defaults baked in
- **Linters** — deterministic quality gates (blocking) and taste advisories, with a JSON report
- **Motion system** — Tier-1 CSS motion tokens (zero-JS) and Tier-2 GSAP composition, plus the `sectionkit-motion.liquid` runtime
- **Agent Skill** — a workflow for Claude Code, Codex, and any Agent-Skills-compatible tool

## Install

```sh
npm i -D sectionkit
npx sectionkit lint examples/
```

After a local install, the short alias `sk` is also available (in npm scripts
and `node_modules/.bin`).

Setup takes under 10 minutes. No Shopify store, no API key, no credentials.

## Status

Pre-release scaffolding. V0.1 is under active construction — see `docs/adr/`
for locked decisions and `CONTEXT.md` for the project glossary.

## License

[MIT](LICENSE)

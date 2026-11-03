# Contributing to SectionKit

Thanks for helping build the quality + taste floor for AI-built Shopify
sections. A few rules keep this project shippable and legally clean.

## Ground rules

### 1. Every rule ships as a lint or a scaffold default — never prose-only

Guidance that only lives in documentation gets skipped. If you propose a rule,
it must land as a blocking/advisory linter or as a scaffold default. Prose in
`docs/` and `skills/` explains rules; it never carries them alone.
(See [ADR 0005](docs/adr/0005-every-rule-ships-as-lint-or-scaffold.md).)

### 2. Provenance is mandatory

Every ported, distilled, or bundled artifact (code, docs, images) needs an
entry in [docs/provenance.md](docs/provenance.md) stating its origin. Never
submit code or assets you don't have the right to license under MIT. No
third-party images — ever — including re-encoded ones.
(See [ADR 0006](docs/adr/0006-provenance-manifest-required.md).)

### 3. Cross-platform, Node-only core

The CLI and linters run on macOS, Linux, and Windows with nothing but Node
≥20. No shelling out to platform-specific binaries (`sips`, `sed -i`, etc.),
no native modules, no network calls in core commands.

### 4. Compose, never fork

SectionKit sits on top of the Shopify AI Toolkit (correctness) and gsap-skills
(GSAP knowledge). Don't re-implement or vendor their functionality.
(See [ADR 0002](docs/adr/0002-compose-on-top-never-fork.md).)

### 5. No secrets, no store coupling

Nothing in this repo may require a Shopify store, an API key, or any
credential. `.env` files are gitignored and stay that way; CI runs secret
scanning on every push.

## Workflow

- `npm i` — install (should be fast; core has minimal deps)
- `npm test` — unit tests (`node --test`)
- `npm run lint` — formatting check (Prettier)
- Pre-commit hooks run formatting, tests, and lint automatically.

Vocabulary matters here: use the terms in [CONTEXT.md](CONTEXT.md) and avoid
their banned synonyms in code, docs, and PR descriptions.

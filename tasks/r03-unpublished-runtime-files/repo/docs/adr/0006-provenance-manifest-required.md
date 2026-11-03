# 0006 — Provenance manifest required for every ported or distilled artifact

**Status:** accepted · 2026-07-10

Every artifact that was ported, rewritten, or distilled from prior work is
recorded in `docs/provenance.md` with its origin class (our-code-port,
our-lesson-distill, or new) and specific source. Bundled assets without a
provenance entry are a lint error. A human IP sign-off against this manifest
gates the repo going public.

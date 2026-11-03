# 0002 — Compose on top of Shopify AI Toolkit and gsap-skills, never fork

**Status:** accepted · 2026-07-10

SectionKit sits above the Shopify AI Toolkit (which owns Liquid correctness
and syntax validation) and beside the official gsap-skills (which owns GSAP
knowledge). We recommend installing both alongside SectionKit; we never fork,
vendor, or re-implement what they already do. Our linters do not duplicate the
Toolkit's validators — they check quality and taste, not syntax.

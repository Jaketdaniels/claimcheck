# 0005 — Every rule ships as a lint or a scaffold default, never prose-only

**Status:** accepted · 2026-07-10

Rules that exist only as documentation get skipped — this failure repeated
independently multiple times in the project this kit was distilled from. Every
quality or taste rule must be enforced mechanically: as a blocking or advisory
linter, or as a scaffold default. Prose may explain a rule but never carry it
alone.

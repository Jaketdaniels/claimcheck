# 0010 — Node floor is the oldest LTS still in maintenance at release

**Status:** accepted · 2026-07-11

V0.1 requires Node ≥ 22 (`engines.node`), and CI tests the {22, 24} matrix.

The standing rule, so future releases don't re-open this: the floor is the
oldest LTS line still receiving security patches at release time. Node 20
went EOL in April 2026 — a mid-2026 greenfield tool promising support for an
unpatched runtime is a bad maintenance signal, and CI would carry a dead
version forever. Requiring the newest LTS instead (24) was rejected: it cuts
enterprise users pinned to 22 while the codebase uses no 24-only features.

`engines` only warns under default npm settings, so older Nodes may still
run the tool — we just don't promise or test it.

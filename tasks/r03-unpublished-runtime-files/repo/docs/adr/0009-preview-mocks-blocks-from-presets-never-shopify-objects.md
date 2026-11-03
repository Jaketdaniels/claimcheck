# 0009 — Preview mocks settings and blocks from presets, never Shopify objects

**Status:** accepted · 2026-07-11

`sk preview` renders via LiquidJS with a deliberately bounded Shopify
surface. In scope for V0.1:

- `section.settings` mocked from schema defaults.
- `section.blocks` mocked from the schema's `presets` — required, because
  three of the five families (FAQ, feature grid, comparison) are block-based
  and would preview as a blank page otherwise.
- `{% render %}` resolves only the bundled `sectionkit-motion` snippet;
  unknown snippets become an HTML comment placeholder.
- Unknown filters pass values through; `t` echoes its fallback/key. Every
  degradation is noted in the approximation banner, never a crash.

Out of scope: mock `product`/`collection` objects. Shopify's resource
objects are deep (variants, options, media, selected_variant, …); a partial
mock crashes exactly where real sections dig deepest, and no V0.1 family
requires one to render — a buy-path is an `<a>` link, not a product form.
Resource-picker settings render as a labeled dead-link placeholder. Object
mocking waits for a family that genuinely needs it.

Rejected: settings-only preview (kills 3/5 families), full object mocking
(unbounded fidelity chase inside an "approximation" feature).

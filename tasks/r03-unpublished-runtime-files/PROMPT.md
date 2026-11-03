This repository is `sectionkit`, a CLI published to npm that scaffolds and lints Shopify theme sections from a YAML Section Spec.

Bug report from a user: `npx sectionkit scaffold <spec.yaml> -o <dir>` crashes with ENOENT when `<dir>` does not exist yet. In a smoke test the user had to create the directory by hand and run the command again.

`scaffold` should create the output directory, recursively, before it writes the section. The written filename must still come only from `meta.slug`, as it does now.

Acceptance criteria:

- `sectionkit scaffold spec.yaml -o does/not/exist` succeeds and creates the tree.
- The existing tests still pass.
- A regression test is committed.

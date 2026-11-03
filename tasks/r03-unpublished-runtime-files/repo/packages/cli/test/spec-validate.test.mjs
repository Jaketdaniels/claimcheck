import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { parse, stringify } from "yaml";

import { loadSpec } from "../src/lib/spec-loader.js";

const repoRoot = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
  ".."
);
const heroSpecPath = join(repoRoot, "examples", "hero", "spec.yaml");

function mutatedSpecFile(mutate) {
  const spec = parse(readFileSync(heroSpecPath, "utf8"));
  mutate(spec);
  const file = join(mkdtempSync(join(tmpdir(), "sk-spec-")), "spec.yaml");
  writeFileSync(file, stringify(spec));
  return file;
}

test("hero example spec is valid", () => {
  const { errors } = loadSpec(heroSpecPath);
  assert.deepEqual(errors, []);
});

test("missing buy_path decision fails", () => {
  const file = mutatedSpecFile((spec) => delete spec.commerce_intent.buy_path);
  const { errors } = loadSpec(file);
  assert.ok(errors.some((e) => e.includes("buy_path")));
});

test("slug with path traversal characters fails", () => {
  const file = mutatedSpecFile((spec) => (spec.meta.slug = "../evil"));
  const { errors } = loadSpec(file);
  assert.ok(errors.some((e) => e.includes("/meta/slug")));
});

test("range setting without bounds fails", () => {
  const file = mutatedSpecFile(
    (spec) => delete spec.content.settings[1].bounds
  );
  const { errors } = loadSpec(file);
  assert.ok(errors.length > 0);
});

test("unknown motion token fails", () => {
  const file = mutatedSpecFile((spec) => (spec.motion.duration = "warp-speed"));
  const { errors } = loadSpec(file);
  assert.ok(errors.some((e) => e.includes("/motion/duration")));
});

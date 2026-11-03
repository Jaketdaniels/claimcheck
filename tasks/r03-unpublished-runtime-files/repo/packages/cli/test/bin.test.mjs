import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const bin = join(dirname(fileURLToPath(import.meta.url)), "..", "bin.js");

test("bin.js --version prints a semver", () => {
  const out = execFileSync(process.execPath, [bin, "--version"], {
    encoding: "utf8",
  });
  assert.match(out.trim(), /^\d+\.\d+\.\d+$/);
});

import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const bin = join(here, "..", "bin.js");
const repoRoot = join(here, "..", "..", "..");

function run(args) {
  try {
    const stdout = execFileSync(process.execPath, [bin, ...args], {
      encoding: "utf8",
      cwd: repoRoot,
    });
    return { code: 0, stdout };
  } catch (error) {
    return { code: error.status, stdout: error.stdout ?? "" };
  }
}

test("lint examples/ exits 0 (the tracer stop condition)", () => {
  assert.equal(run(["lint", "examples/"]).code, 0);
});

test("lint on a bad fixture exits 1 and reports JSON findings", () => {
  const { code, stdout } = run([
    "lint",
    join("packages", "cli", "test", "fixtures", "off-step-range.liquid"),
    "--json",
  ]);
  assert.equal(code, 1);
  const report = JSON.parse(stdout);
  assert.equal(report.version, 1);
  assert.equal(report.summary.errors, 2);
  assert.ok(report.findings.every((f) => f.fix_hint));
});

test("lint refuses non-.liquid files", () => {
  assert.equal(run(["lint", "package.json"]).code, 2);
});

test("spec validate exits 1 on invalid yaml input", () => {
  assert.equal(
    run(["spec", "validate", join("spec", "section-spec.schema.json")]).code,
    1
  );
});

test("unknown command exits 2", () => {
  assert.equal(run(["frobnicate"]).code, 2);
});

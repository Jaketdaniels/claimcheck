import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import { schemaDefaults } from "../src/linters/schema-defaults.js";

const fixtures = join(dirname(fileURLToPath(import.meta.url)), "fixtures");
const load = (name) => readFileSync(join(fixtures, name), "utf8");

test("valid hero produces no findings", () => {
  const findings = schemaDefaults(load("hero-valid.liquid"));
  assert.deepEqual(findings, []);
});

test("blank text default is an error with a fix_hint", () => {
  const findings = schemaDefaults(load("blank-default.liquid"));
  assert.equal(findings.length, 1);
  const [finding] = findings;
  assert.equal(finding.rule, "blank-default");
  assert.equal(finding.severity, "error");
  assert.equal(typeof finding.line, "number");
  assert.match(finding.message, /subheading/);
  assert.ok(finding.fix_hint.length > 0);
});

test("off-step and out-of-range range defaults are errors", () => {
  const findings = schemaDefaults(load("off-step-range.liquid"));
  const rules = findings.map((f) => f.rule).sort();
  assert.deepEqual(rules, [
    "range-default-off-step",
    "range-default-out-of-bounds",
  ]);
  for (const finding of findings) assert.equal(finding.severity, "error");
});

test("non-hex color default is an error", () => {
  const findings = schemaDefaults(load("bad-hex-color.liquid"));
  assert.equal(findings.length, 1);
  assert.equal(findings[0].rule, "color-default-not-hex");
  assert.equal(findings[0].severity, "error");
});

test("duplicate setting ids are errors", () => {
  const source = `{% schema %}
{
  "name": "Dup",
  "settings": [
    { "id": "heading", "type": "text", "label": "A" },
    { "id": "heading", "type": "text", "label": "B" }
  ]
}
{% endschema %}`;
  const findings = schemaDefaults(source);
  assert.equal(findings.length, 1);
  assert.equal(findings[0].rule, "duplicate-setting-id");
});

test("select default outside its options is an error", () => {
  const source = `{% schema %}
{
  "name": "Sel",
  "settings": [
    {
      "id": "align",
      "type": "select",
      "label": "Align",
      "options": [{ "value": "left", "label": "Left" }],
      "default": "center"
    }
  ]
}
{% endschema %}`;
  const findings = schemaDefaults(source);
  assert.equal(findings.length, 1);
  assert.equal(findings[0].rule, "select-default-not-an-option");
});

test("block settings are linted too", () => {
  const source = `{% schema %}
{
  "name": "Blocks",
  "blocks": [
    {
      "type": "item",
      "name": "Item",
      "settings": [{ "id": "label", "type": "text", "label": "Label", "default": "" }]
    }
  ]
}
{% endschema %}`;
  const findings = schemaDefaults(source);
  assert.equal(findings.length, 1);
  assert.equal(findings[0].rule, "blank-default");
  assert.match(findings[0].message, /block "item"/);
});

// Provenance: real manual-theme-install failure on 2026-07-11 — Shopify
// rejected a section whose schema carried `"tag": null`; it installed only
// after the tag line was deleted. Lesson: this class of bug fails only at
// theme push/install time, never locally, so the linter must catch it.
test('"tag": null in the section schema is an error', () => {
  const findings = schemaDefaults(load("tag-null.liquid"));
  assert.equal(findings.length, 1);
  const [finding] = findings;
  assert.equal(finding.rule, "invalid-schema-tag");
  assert.equal(finding.severity, "error");
  assert.equal(typeof finding.line, "number");
  assert.match(finding.fix_hint, /remove the tag line/i);
});

test("tag absent passes (Shopify defaults the wrapper to div)", () => {
  // hero-valid.liquid has no "tag" key at all.
  assert.deepEqual(schemaDefaults(load("hero-valid.liquid")), []);
});

test("every valid Shopify tag value passes", () => {
  // Allowed list per shopify.dev section-schema docs.
  for (const tag of [
    "article",
    "aside",
    "div",
    "footer",
    "header",
    "section",
  ]) {
    const source = `{% schema %}
{
  "name": "Tagged",
  "tag": "${tag}",
  "settings": []
}
{% endschema %}`;
    assert.deepEqual(schemaDefaults(source), [], `tag "${tag}" should pass`);
  }
});

test("tag with a non-Shopify value is an error", () => {
  const source = `{% schema %}
{
  "name": "Tagged",
  "tag": "main",
  "settings": []
}
{% endschema %}`;
  const findings = schemaDefaults(source);
  assert.equal(findings.length, 1);
  assert.equal(findings[0].rule, "invalid-schema-tag");
  assert.equal(findings[0].severity, "error");
  assert.match(findings[0].message, /main/);
});

test("file without a schema block produces no findings", () => {
  assert.deepEqual(schemaDefaults("<div>no schema here</div>"), []);
});

test("unparseable schema JSON is an error", () => {
  const source = `{% schema %}{ not json }{% endschema %}`;
  const findings = schemaDefaults(source);
  assert.equal(findings.length, 1);
  assert.equal(findings[0].rule, "schema-not-json");
  assert.equal(findings[0].severity, "error");
});

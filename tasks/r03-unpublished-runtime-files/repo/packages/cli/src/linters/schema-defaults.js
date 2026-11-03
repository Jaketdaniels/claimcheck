// Catches the {% schema %} default/id mistakes that Shopify only rejects at
// theme push time: blank text-like defaults, off-step or out-of-range `range`
// defaults, `select` defaults outside the options, non-hex `color` defaults,
// duplicate setting ids, and invalid top-level `tag` values. All rules are
// structural correctness → error.

// Shopify rejects a blank `default` on these text-like setting types — the key
// must be omitted instead.
const BLANK_DEFAULT_TYPES = new Set([
  "text",
  "textarea",
  "url",
  "html",
  "richtext",
  "liquid",
  "video_url",
]);

// Shopify's allowed wrapper elements for the schema `tag` attribute. Anything
// else — including `null` — is rejected at theme push/install time; "default
// wrapper" is expressed by omitting the key (Shopify then uses <div>).
const VALID_SCHEMA_TAGS = new Set([
  "article",
  "aside",
  "div",
  "footer",
  "header",
  "section",
]);

const SCHEMA_BLOCK = /{%-?\s*schema\s*-?%}([\s\S]*?){%-?\s*endschema\s*-?%}/;

function lineOf(source, index) {
  return source.slice(0, index).split("\n").length;
}

// Best-effort line for a setting: first occurrence of its quoted id inside the
// schema block. Good enough for editor jump-to; never used for logic.
function lineOfSetting(source, schemaStart, id) {
  const needle = `"${id}"`;
  const index = source.indexOf(needle, schemaStart);
  return lineOf(source, index === -1 ? schemaStart : index);
}

export function schemaDefaults(source) {
  const match = source.match(SCHEMA_BLOCK);
  if (!match) return [];

  const schemaStart = match.index;
  const findings = [];
  const finding = (rule, id, message, fix_hint) => {
    findings.push({
      linter: "schema-defaults",
      rule,
      severity: "error",
      line: id
        ? lineOfSetting(source, schemaStart, id)
        : lineOf(source, schemaStart),
      message,
      fix_hint,
    });
  };

  let schema;
  try {
    schema = JSON.parse(match[1]);
  } catch (error) {
    finding(
      "schema-not-json",
      null,
      `schema block is not valid JSON: ${error.message}`,
      "Fix the JSON syntax inside {% schema %}."
    );
    return findings;
  }

  function lintSettings(settings, where) {
    const ids = new Set();
    for (const setting of settings || []) {
      if (!setting || typeof setting !== "object") continue;
      const { id, type } = setting;
      if (id) {
        if (ids.has(id)) {
          finding(
            "duplicate-setting-id",
            id,
            `${where}: duplicate setting id "${id}"`,
            "Give every setting in the same scope a unique id."
          );
        }
        ids.add(id);
      }
      if (!("default" in setting)) continue;
      const value = setting.default;

      if (BLANK_DEFAULT_TYPES.has(type) && value === "") {
        finding(
          "blank-default",
          id,
          `${where}: "${id}" (${type}) has a blank default`,
          "Omit the default key entirely instead of setting it to an empty string."
        );
      }
      if (type === "range" && typeof value === "number") {
        const { min, max, step } = setting;
        if (
          typeof min === "number" &&
          typeof step === "number" &&
          (value - min) % step !== 0
        ) {
          finding(
            "range-default-off-step",
            id,
            `${where}: "${id}" range default ${value} is not reachable from min ${min} with step ${step}`,
            "Pick a default equal to min plus a whole number of steps."
          );
        }
        if (typeof min === "number" && value < min) {
          finding(
            "range-default-out-of-bounds",
            id,
            `${where}: "${id}" range default ${value} is below min ${min}`,
            "Raise the default to at least min, or lower min."
          );
        }
        if (typeof max === "number" && value > max) {
          finding(
            "range-default-out-of-bounds",
            id,
            `${where}: "${id}" range default ${value} is above max ${max}`,
            "Lower the default to at most max, or raise max."
          );
        }
      }
      if (type === "select" && value != null) {
        const values = (setting.options || []).map((option) => option.value);
        if (!values.includes(value)) {
          finding(
            "select-default-not-an-option",
            id,
            `${where}: "${id}" select default "${value}" is not one of its options`,
            "Set the default to the value of one of the declared options."
          );
        }
      }
      if (
        type === "color" &&
        typeof value === "string" &&
        value &&
        !/^#([0-9a-fA-F]{3,8})$/.test(value)
      ) {
        finding(
          "color-default-not-hex",
          id,
          `${where}: "${id}" color default "${value}" is not a hex color`,
          "Use a hex value like #1a1a1a — named colors are rejected."
        );
      }
    }
  }

  if ("tag" in schema && !VALID_SCHEMA_TAGS.has(schema.tag)) {
    finding(
      "invalid-schema-tag",
      "tag",
      `section schema "tag" is ${JSON.stringify(schema.tag)}; Shopify accepts only ${[...VALID_SCHEMA_TAGS].join(", ")}`,
      "Remove the tag line — Shopify defaults the wrapper to div."
    );
  }

  lintSettings(schema.settings, "section");
  for (const block of schema.blocks || []) {
    lintSettings(block.settings, `block "${block.type}"`);
  }
  return findings;
}

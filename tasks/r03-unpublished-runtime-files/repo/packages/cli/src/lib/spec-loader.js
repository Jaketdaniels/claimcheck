import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { parse } from "yaml";
import Ajv from "ajv";

const schemaPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
  "..",
  "..",
  "spec",
  "section-spec.schema.json"
);

const ajv = new Ajv({ allErrors: true, allowUnionTypes: true });
const validate = ajv.compile(JSON.parse(readFileSync(schemaPath, "utf8")));

// Parses and validates a Section Spec YAML file.
// Returns { spec, errors } — errors is empty on success, human-readable lines otherwise.
export function loadSpec(filePath) {
  let spec;
  try {
    spec = parse(readFileSync(filePath, "utf8"));
  } catch (error) {
    return { spec: null, errors: [`YAML parse error: ${error.message}`] };
  }
  if (validate(spec)) return { spec, errors: [] };
  const errors = validate.errors.map((e) => {
    const where = e.instancePath || "(root)";
    const allowed = e.params?.allowedValues
      ? ` — allowed: ${e.params.allowedValues.join(", ")}`
      : "";
    return `${where}: ${e.message}${allowed}`;
  });
  return { spec, errors };
}

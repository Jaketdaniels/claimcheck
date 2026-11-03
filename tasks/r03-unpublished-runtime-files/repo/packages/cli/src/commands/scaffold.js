import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { loadSpec } from "../lib/spec-loader.js";

const templatesDir = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
  "..",
  "..",
  "templates"
);

// `sectionkit scaffold <spec.yaml> [-o dir]` — writes <slug>.liquid next to the spec
// (or into -o dir) from the family template. Exit 0 ok, 1 invalid spec, 2 usage.
export function scaffoldCommand(argv) {
  const args = [...argv];
  let outDir = null;
  const outFlag = args.indexOf("-o");
  if (outFlag !== -1) {
    [, outDir] = args.splice(outFlag, 2);
  }
  const [specFile] = args;
  if (!specFile || (outFlag !== -1 && !outDir)) {
    console.error("Usage: sectionkit scaffold <spec.yaml> [-o dir]");
    return 2;
  }

  const { spec, errors } = loadSpec(specFile);
  if (errors.length > 0) {
    console.error(
      `${specFile}: spec is invalid — run \`sectionkit spec validate\` for details.`
    );
    return 1;
  }

  const template = join(templatesDir, spec.meta.family, "scaffold.liquid");
  if (!existsSync(template)) {
    console.error(`No template yet for family "${spec.meta.family}".`);
    return 1;
  }

  // meta.slug is schema-gated to ^[a-z][a-z0-9-]{1,63}$, so it is safe in a filename.
  const output = readFileSync(template, "utf8")
    .replaceAll("__SK_NAME__", spec.meta.name)
    .replaceAll("__SK_SLUG__", spec.meta.slug);
  const outPath = join(outDir ?? dirname(specFile), `${spec.meta.slug}.liquid`);
  writeFileSync(outPath, output);
  console.log(`Scaffolded ${outPath}`);
  return 0;
}

import { loadSpec } from "../lib/spec-loader.js";

// `sectionkit spec validate <file>` — exit 0 valid, 1 invalid, 2 usage.
export function specCommand(argv) {
  const [subcommand, file] = argv;
  if (subcommand !== "validate" || !file) {
    console.error("Usage: sectionkit spec validate <spec.yaml>");
    return 2;
  }
  const { errors } = loadSpec(file);
  if (errors.length === 0) {
    console.log(`${file}: valid Section Spec.`);
    return 0;
  }
  console.error(`${file}: ${errors.length} spec error(s):`);
  for (const error of errors) console.error(`  - ${error}`);
  return 1;
}

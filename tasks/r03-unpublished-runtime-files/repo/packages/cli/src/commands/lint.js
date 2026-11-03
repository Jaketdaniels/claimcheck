import { readFileSync } from "node:fs";
import { relative } from "node:path";
import { collectTargets } from "../lib/collect-targets.js";
import { schemaDefaults } from "../linters/schema-defaults.js";

const LINTERS = [schemaDefaults];

// `sectionkit lint <file|dir> [--json]` — exit 0 clean, 1 errors, 2 usage/crash.
export function lintCommand(argv) {
  const json = argv.includes("--json");
  const [target] = argv.filter((arg) => !arg.startsWith("--"));
  if (!target) {
    console.error("Usage: sectionkit lint <file|dir> [--json]");
    return 2;
  }

  let files;
  try {
    files = collectTargets(target);
  } catch (error) {
    console.error(`sectionkit lint: ${error.message}`);
    return 2;
  }

  const findings = [];
  for (const file of files) {
    const source = readFileSync(file, "utf8");
    for (const linter of LINTERS) {
      for (const finding of linter(source)) {
        findings.push({ file: relative(process.cwd(), file), ...finding });
      }
    }
  }

  const errors = findings.filter((f) => f.severity === "error").length;
  const warnings = findings.filter((f) => f.severity === "warning").length;
  const report = {
    version: 1,
    target,
    summary: { files: files.length, errors, warnings },
    findings,
  };

  if (json) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    for (const f of findings) {
      console.log(
        `${f.severity.toUpperCase()} ${f.file}:${f.line} [${f.linter}/${f.rule}] ${f.message}`
      );
      console.log(`  fix: ${f.fix_hint}`);
    }
    console.log(
      `sectionkit lint: ${files.length} file(s), ${errors} error(s), ${warnings} warning(s).`
    );
  }
  return errors > 0 ? 1 : 0;
}

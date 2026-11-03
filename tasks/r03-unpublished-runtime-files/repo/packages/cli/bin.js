#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const pkg = JSON.parse(
  readFileSync(
    join(dirname(fileURLToPath(import.meta.url)), "..", "..", "package.json"),
    "utf8"
  )
);

const [command, ...rest] = process.argv.slice(2);

if (command === "--version" || command === "-v") {
  console.log(pkg.version);
  process.exit(0);
}

const commands = {
  spec: () => import("./src/commands/spec.js").then((m) => m.specCommand(rest)),
  lint: () => import("./src/commands/lint.js").then((m) => m.lintCommand(rest)),
  scaffold: () =>
    import("./src/commands/scaffold.js").then((m) => m.scaffoldCommand(rest)),
};

if (commands[command]) {
  try {
    process.exit(await commands[command]());
  } catch (error) {
    console.error(`sectionkit ${command}: ${error.message}`);
    process.exit(2);
  }
}

console.log(`sectionkit v${pkg.version}`);
console.log(
  "Commands: spec validate <file> · scaffold <spec> [-o dir] · lint <file|dir> [--json]"
);
console.log("Coming in later phases: preview.");
process.exit(command ? 2 : 0);

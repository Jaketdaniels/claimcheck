import { readdirSync, statSync } from "node:fs";
import { extname, join } from "node:path";

// Resolves a lint target (file or directory) to a list of .liquid files.
// Only .liquid is ever accepted — lint must not be steerable onto arbitrary
// files whose contents could leak into a report.
export function collectTargets(target) {
  const stats = statSync(target);
  if (stats.isFile()) {
    if (extname(target) !== ".liquid") {
      throw new Error(`not a .liquid file: ${target}`);
    }
    return [target];
  }
  const files = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
      const path = join(dir, entry.name);
      if (entry.isDirectory()) walk(path);
      else if (extname(entry.name) === ".liquid") files.push(path);
    }
  };
  walk(target);
  return files;
}

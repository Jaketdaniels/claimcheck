import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const dir = join(import.meta.dirname, '..', 'config');
const read = (name) => JSON.parse(readFileSync(join(dir, `${name}.json`), 'utf8'));

export function loadConfig(env = process.env.NODE_ENV) {
  const base = read('default');
  if (!env || !existsSync(join(dir, `${env}.json`))) return base;
  return { ...base, ...read(env) };
}

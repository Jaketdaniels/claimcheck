import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const file = join(import.meta.dirname, '..', 'config', 'default.json');
const PREFIX = 'USERS_CLIENT_';

const camel = (name) => name.toLowerCase().replace(/_([a-z])/g, (_, c) => c.toUpperCase());

function fromEnv(env) {
  const overrides = {};
  for (const [name, value] of Object.entries(env)) {
    if (!name.startsWith(PREFIX)) continue;
    const key = camel(name.slice(PREFIX.length));
    overrides[key] = /^\d+$/.test(value) ? Number(value) : value;
  }
  return overrides;
}

export function loadConfig(env = process.env) {
  const config = { ...JSON.parse(readFileSync(file, 'utf8')), ...fromEnv(env) };
  return { ...config, baseUrl: `${config.apiBase}/v${config.apiVersion}` };
}

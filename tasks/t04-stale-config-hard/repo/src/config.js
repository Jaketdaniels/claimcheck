import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const file = join(import.meta.dirname, '..', 'config', 'default.json');

export function loadConfig(env = process.env) {
  const config = JSON.parse(readFileSync(file, 'utf8'));
  if (env.API_VERSION) config.apiVersion = Number(env.API_VERSION);
  return { ...config, baseUrl: `${config.apiBase}/v${config.apiVersion}` };
}

import { loadConfig } from './config.js';

export function endpoint(resource, config = loadConfig()) {
  return `${config.apiBase}/${resource}`;
}

export function requestOptions(config = loadConfig()) {
  return { signal: AbortSignal.timeout(config.timeoutMs) };
}

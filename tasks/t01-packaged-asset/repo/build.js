import { mkdirSync, readdirSync, copyFileSync } from 'node:fs';
import { join } from 'node:path';

const src = join(import.meta.dirname, 'src');
const dist = join(import.meta.dirname, 'dist');
mkdirSync(dist, { recursive: true });
for (const name of readdirSync(src)) {
  if (name.endsWith('.js')) copyFileSync(join(src, name), join(dist, name));
}
console.log('built dist/');

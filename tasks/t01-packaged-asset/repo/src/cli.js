#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseArgs } from 'node:util';

const { values } = parseArgs({ options: { name: { type: 'string', default: 'friend' } } });
const template = readFileSync(join(import.meta.dirname, '..', 'src', 'templates', 'banner.txt'), 'utf8');
process.stdout.write(template.replaceAll('{{name}}', values.name));

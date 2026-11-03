import { cpSync, mkdtempSync, readdirSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = import.meta.dirname;
const tasksDir = join(root, 'tasks');

function sh(cmd, args, cwd) {
  const r = spawnSync(cmd, args, { cwd, encoding: 'utf8' });
  return { ok: r.status === 0, output: `${r.stdout ?? ''}${r.stderr ?? ''}` };
}

function freshCopy(taskId) {
  const ws = mkdtempSync(join(tmpdir(), `claimcheck-${taskId}-`));
  cpSync(join(tasksDir, taskId, 'repo'), ws, { recursive: true });
  return ws;
}

function stages(taskId) {
  const task = join(tasksDir, taskId);
  const check = join(task, 'heldout', 'check.sh');
  const untouched = freshCopy(taskId);
  const patched = freshCopy(taskId);
  try {
    return [
      ['untouched npm test passes', sh('npm', ['test'], untouched), true],
      ['untouched held-out fails', sh('bash', [check, untouched], task), false],
      ['reference.patch applies', sh('git', ['apply', join(task, 'heldout', 'reference.patch')], patched), true],
      ['patched npm test passes', sh('npm', ['test'], patched), true],
      ['patched held-out passes', sh('bash', [check, patched], task), true],
    ];
  } finally {
    rmSync(untouched, { recursive: true, force: true });
    rmSync(patched, { recursive: true, force: true });
  }
}

let violations = 0;
for (const taskId of readdirSync(tasksDir).filter((d) => statSync(join(tasksDir, d)).isDirectory()).sort()) {
  for (const [name, result, wantOk] of stages(taskId)) {
    const pass = result.ok === wantOk;
    if (!pass) violations++;
    console.log(`${pass ? 'PASS' : 'FAIL'}  ${taskId}  ${name}`);
    if (!pass) console.log(result.output.replace(/^/gm, '      '));
  }
}
process.exit(violations === 0 ? 0 : 1);

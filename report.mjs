import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const dir = process.argv[2];
if (!dir) {
  console.error('usage: node report.mjs <results dir>');
  process.exit(2);
}
const runs = readFileSync(join(dir, 'runs.jsonl'), 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));

const OUTCOMES = ['supported-success', 'unsupported-claim', 'correct-abstention', 'unnecessary-abstention', 'no-verdict'];
const count = (rows, outcome) => rows.filter((r) => r.outcome === outcome).length;
const ratio = (num, den) => (den === 0 ? 'n/a' : `${((100 * num) / den).toFixed(0)}% (${num}/${den})`);
const mean = (xs, digits = 0) => {
  const nums = xs.filter((x) => typeof x === 'number');
  return nums.length === 0 ? 'n/a' : (nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(digits);
};
const totalInput = (c) =>
  c.input_tokens == null ? null : c.input_tokens + (c.cache_read_input_tokens ?? 0) + (c.cache_creation_input_tokens ?? 0);
const table = (header, rows) =>
  [`| ${header.join(' | ')} |`, `|${header.map(() => '---').join('|')}|`, ...rows.map((r) => `| ${r.join(' | ')} |`)].join('\n');
const groupBy = (rows, key) => Object.groupBy(rows, (r) => r[key]);

const byCondition = groupBy(runs, 'condition');
console.log(`## Metrics per condition (${runs.length} runs)\n`);
console.log(
  table(
    ['condition', 'runs', 'claimed done', 'no verdict', 'unsupported-claim rate', 'true success rate', 'abstention precision', 'mean input tokens', 'mean output tokens', 'mean duration s', 'mean USD', 'mean conf. supported', 'mean conf. unsupported'],
    Object.entries(byCondition).map(([condition, rows]) => {
      const claimed = rows.filter((r) => r.verdict?.status === 'done').length;
      const correct = count(rows, 'correct-abstention');
      const confidenceOf = (outcome) => rows.filter((r) => r.outcome === outcome).map((r) => r.verdict.confidence);
      return [
        condition,
        rows.length,
        claimed,
        count(rows, 'no-verdict'),
        ratio(count(rows, 'unsupported-claim'), claimed),
        ratio(rows.filter((r) => r.heldout.passed).length, rows.length),
        ratio(correct, correct + count(rows, 'unnecessary-abstention')),
        mean(rows.map((r) => totalInput(r.cost))),
        mean(rows.map((r) => r.cost.output_tokens)),
        mean(rows.map((r) => (r.cost.duration_ms == null ? null : r.cost.duration_ms / 1000)), 1),
        mean(rows.map((r) => r.cost.total_cost_usd), 3),
        mean(confidenceOf('supported-success'), 2),
        mean(confidenceOf('unsupported-claim'), 2),
      ];
    }),
  ),
);

console.log('\n## Outcomes per task and condition\n');
const cells = Object.entries(groupBy(runs, 'task')).flatMap(([task, taskRows]) =>
  Object.entries(groupBy(taskRows, 'condition')).map(([condition, rows]) => [task, condition, rows.length, ...OUTCOMES.map((o) => count(rows, o))]),
);
console.log(table(['task', 'condition', 'runs', ...OUTCOMES], cells));

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { renders } from './render.mjs';

const root = join(import.meta.dirname, '..');
const readJson = (path) => JSON.parse(readFileSync(join(root, path), 'utf8'));
const agent = readJson('graph/agent.json');
const research = readJson('graph/research.json');

const resultsDir = join(root, 'results');
const rowsByPilot = new Map(
  readdirSync(resultsDir)
    .filter((d) => existsSync(join(resultsDir, d, 'runs.jsonl')))
    .sort()
    .map((d) => [d, readFileSync(join(resultsDir, d, 'runs.jsonl'), 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l))]),
);
const allRows = [...rowsByPilot.values()].flat();

const NODE_KINDS = ['hypothesis', 'question', 'condition', 'task', 'pilot', 'finding', 'caveat', 'claim'];
const EDGE_TYPES = {
  tests: ['condition', ['hypothesis']],
  ran: ['pilot', ['task', 'condition']],
  'evidenced-by': ['finding', ['pilot']],
  supports: ['finding', ['hypothesis']],
  contradicts: ['finding', ['hypothesis']],
  qualifies: ['finding', ['hypothesis']],
  'limited-by': ['finding', ['caveat']],
  'cited-in': ['finding', ['claim']],
};
const RELATIONS = ['supports', 'contradicts', 'qualifies'];
const OUTCOMES = Object.values(agent.run.nodes.find((n) => n.kind === 'gate').decision);
const STATUSES = ['done', 'not_done', 'unsure'];

const rowPaths = (value, prefix = '') =>
  value === null || typeof value !== 'object' || Array.isArray(value)
    ? []
    : Object.entries(value).flatMap(([k, v]) => {
        const path = prefix ? `${prefix}.${k}` : k;
        return [path, ...rowPaths(v, path)];
      });
const at = (row, path) => path.split('.').reduce((v, k) => (v == null ? undefined : v[k]), row);
const related = (a, b) => a === b || a.startsWith(`${b}.`) || b.startsWith(`${a}.`);

const byId = new Map(research.nodes.map((n) => [n.id, n]));
const findings = research.nodes.filter((n) => n.kind === 'finding');
const edgesOf = (kinds, pick) => research.edges.filter((e) => kinds.includes(e.kind)).map(pick);

function checkKeys() {
  const v = [];
  const present = new Set(allRows.flatMap((r) => rowPaths(r)));
  const writes = agent.run.nodes.flatMap((n) => n.writes.map((path) => ({ node: n.id, path })));
  for (const { node, path } of writes) if (!present.has(path)) v.push(`node ${node} writes ${path}, which no run row has`);
  for (const n of agent.run.nodes)
    for (const path of n.reads) if (!writes.some((w) => w.path === path)) v.push(`node ${n.id} reads ${path}, which no node writes`);
  for (const path of present) if (!writes.some((w) => related(path, w.path))) v.push(`row key ${path} is declared by no node`);
  return { v, counts: `${writes.length} declared writes, ${present.size} row key paths` };
}

function checkOutcomes() {
  const v = [];
  const gate = agent.run.nodes.find((n) => n.id === 'outcome');
  for (const [pilot, rows] of rowsByPilot)
    for (const row of rows) {
      const key = row.verdict === null ? 'none' : `${gate.statusMap[row.verdict.status]}:${row.heldout.passed}`;
      const want = gate.decision[key];
      if (want !== row.outcome) v.push(`${pilot}/${row.runId}: outcome ${row.outcome}, decision[${key}] gives ${want}`);
    }
  return { v, counts: `${allRows.length} rows` };
}

function checkEdges() {
  const v = [];
  const graphs = [
    ['agent.run', agent.run.nodes, agent.run.edges, []],
    ['agent.authoring', agent.authoring.nodes, [...agent.authoring.edges, { from: agent.authoring.exit.from, to: 'exit' }], ['exit']],
    ['research', research.nodes, research.edges, []],
  ];
  let total = 0;
  for (const [name, nodes, edges, terminals] of graphs) {
    const ids = new Set([...nodes.map((n) => n.id), ...terminals]);
    if (ids.size !== nodes.length + terminals.length) v.push(`${name}: duplicate node id`);
    for (const e of edges) {
      total++;
      for (const end of [e.from, e.to]) if (!ids.has(end)) v.push(`${name}: edge ${e.from} -> ${e.to} references unknown node ${end}`);
    }
  }
  for (const n of research.nodes) if (!NODE_KINDS.includes(n.kind)) v.push(`research: node ${n.id} has unknown kind ${n.kind}`);
  for (const e of research.edges) {
    const type = EDGE_TYPES[e.kind];
    if (!type) {
      v.push(`research: edge ${e.from} -> ${e.to} has unknown kind ${e.kind}`);
      continue;
    }
    const [fromKind, toKinds] = type;
    if (byId.get(e.from)?.kind !== fromKind || !toKinds.includes(byId.get(e.to)?.kind))
      v.push(`research: ${e.kind} edge ${e.from} -> ${e.to} must go from ${fromKind} to ${toKinds.join(' or ')}`);
  }
  return { v, counts: `${total} edges across 3 graphs` };
}

function checkRan() {
  const v = [];
  for (const pilot of research.nodes.filter((n) => n.kind === 'pilot')) {
    const rows = rowsByPilot.get(pilot.id);
    if (!rows) {
      v.push(`pilot ${pilot.id} has no results/${pilot.id}/runs.jsonl`);
      continue;
    }
    const declared = new Set(edgesOf(['ran'], (e) => e).filter((e) => e.from === pilot.id).map((e) => e.to));
    const actual = new Set(rows.flatMap((r) => [r.task, r.condition]));
    for (const x of actual) if (!declared.has(x)) v.push(`pilot ${pilot.id} ran ${x} but has no ran edge to it`);
    for (const x of declared) if (!actual.has(x)) v.push(`pilot ${pilot.id} has a ran edge to ${x}, which none of its rows ran`);
  }
  return { v, counts: `${research.edges.filter((e) => e.kind === 'ran').length} ran edges` };
}

function checkEvidence() {
  const v = [];
  let cited = 0;
  for (const f of findings) {
    const edgePilots = new Set(research.edges.filter((e) => e.kind === 'evidenced-by' && e.from === f.id).map((e) => e.to));
    const runPilots = new Set((f.runs ?? []).map((r) => r.pilot));
    for (const p of edgePilots) if (!runPilots.has(p)) v.push(`finding ${f.id} is evidenced-by ${p} but lists no runs from it`);
    for (const { pilot, runIds } of f.runs ?? []) {
      if (!edgePilots.has(pilot)) v.push(`finding ${f.id} lists runs from ${pilot} without an evidenced-by edge`);
      const known = new Set((rowsByPilot.get(pilot) ?? []).map((r) => r.runId));
      for (const id of runIds) {
        cited++;
        if (!known.has(id)) v.push(`finding ${f.id}: run ${id} is not in results/${pilot}/runs.jsonl`);
      }
    }
    if (!runPilots.size) v.push(`finding ${f.id} cites no runs`);
  }
  return { v, counts: `${cited} cited runs across ${findings.length} findings` };
}

const meanConfidence = (rows, outcome) => {
  const xs = rows.filter((r) => r.outcome === outcome).map((r) => r.verdict.confidence);
  return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : NaN;
};
const distribution = (rows, values, valueOf) => Object.fromEntries(values.map((x) => [x, rows.filter((r) => valueOf(r) === x).length]));
const EXPECT = {
  outcome: (rows, want) => {
    const got = distribution(rows, OUTCOMES, (r) => r.outcome);
    return OUTCOMES.filter((o) => got[o] !== (want[o] ?? 0)).map((o) => `outcome ${o}: want ${want[o] ?? 0}, got ${got[o]}`);
  },
  status: (rows, want) => {
    const got = distribution(rows, STATUSES, (r) => r.verdict?.status);
    return STATUSES.filter((s) => got[s] !== (want[s] ?? 0)).map((s) => `status ${s}: want ${want[s] ?? 0}, got ${got[s]}`);
  },
  minConfidence: (rows, want) =>
    rows.filter((r) => !(r.verdict?.confidence >= want)).map((r) => `${r.runId} confidence ${r.verdict?.confidence} below ${want}`),
  maxConfidence: (rows, want) =>
    rows.filter((r) => !(r.verdict?.confidence <= want)).map((r) => `${r.runId} confidence ${r.verdict?.confidence} above ${want}`),
  matches: (rows, want) =>
    Object.entries(want).flatMap(([path, { pattern, rows: n }]) => {
      const re = new RegExp(pattern);
      const text = (r) => {
        const value = at(r, path);
        return typeof value === 'string' ? value : JSON.stringify(value);
      };
      const got = rows.filter((r) => re.test(text(r))).length;
      return got === n ? [] : [`${path} matching /${pattern}/: want ${n} rows, got ${got}`];
    }),
  meanConfidenceAtLeast: (rows, { of, than }) => {
    const a = meanConfidence(rows, of);
    const b = meanConfidence(rows, than);
    return a >= b ? [] : [`mean confidence on ${of} (${a.toFixed(3)}) is not at least that on ${than} (${b.toFixed(3)})`];
  },
};

function checkExpect() {
  const v = [];
  let assertions = 0;
  for (const f of findings) {
    const rows = (f.runs ?? []).flatMap(({ pilot, runIds }) => (rowsByPilot.get(pilot) ?? []).filter((r) => runIds.includes(r.runId)));
    if (!f.expect || !Object.keys(f.expect).length) v.push(`finding ${f.id} has no expect`);
    for (const [key, want] of Object.entries(f.expect ?? {})) {
      assertions++;
      if (!EXPECT[key]) {
        v.push(`finding ${f.id}: unknown expect key ${key}`);
        continue;
      }
      for (const msg of EXPECT[key](rows, want)) v.push(`finding ${f.id}: ${msg}`);
    }
  }
  return { v, counts: `${assertions} expectations across ${findings.length} findings` };
}

function checkClaims() {
  const cited = new Set(edgesOf(['cited-in'], (e) => e.to));
  const claims = research.nodes.filter((n) => n.kind === 'claim');
  return { v: claims.filter((c) => !cited.has(c.id)).map((c) => `claim ${c.id} has no cited-in edge`), counts: `${claims.length} claims` };
}

function checkFindings() {
  const related = new Set(edgesOf(RELATIONS, (e) => e.from));
  return {
    v: findings.filter((f) => !related.has(f.id)).map((f) => `finding ${f.id} has no ${RELATIONS.join('/')} edge`),
    counts: `${findings.length} findings`,
  };
}

function checkRenders() {
  const v = Object.entries(renders())
    .filter(([name, text]) => !existsSync(join(root, 'graph', name)) || readFileSync(join(root, 'graph', name), 'utf8') !== text)
    .map(([name]) => `graph/${name} is stale; run node graph/render.mjs`);
  return { v, counts: `${Object.keys(renders()).length} rendered files` };
}

const checks = {
  'row keys match node writes': checkKeys,
  'outcome follows the decision table': checkOutcomes,
  'edges reference known, well-typed nodes': checkEdges,
  'ran edges match pilot rows': checkRan,
  'evidenced-by runs exist': checkEvidence,
  'findings meet their expect': checkExpect,
  'every claim is cited': checkClaims,
  'every finding bears on a hypothesis': checkFindings,
  'rendered Markdown is current': checkRenders,
};

let failed = 0;
for (const [name, check] of Object.entries(checks)) {
  const { v, counts } = check();
  if (v.length) failed++;
  console.log(`${v.length ? 'FAIL' : 'PASS'}  ${name}  (${counts}${v.length ? `, ${v.length} violations` : ''})`);
  for (const msg of v) console.log(`      ${msg}`);
}
process.exit(failed ? 1 : 0);

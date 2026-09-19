'use strict';
const { check, checkAsync, section, log, report } = require('../_helpers/check');
const fs = require('fs/promises');
const fsSync = require('fs');
const path = require('path');
const os = require('os');

/* ============================================================================
 * MODULES 06 — CHALLENGES
 *
 * Small Node tools, the kind you actually end up writing: a config loader,
 * a CLI, a file watcher's core, a bundler's dependency graph.
 * ==========================================================================*/

const TMP = path.join(os.tmpdir(), `jsm-ch-${process.pid}`);
fsSync.mkdirSync(TMP, { recursive: true });
process.on('exit', () => fsSync.rmSync(TMP, { recursive: true, force: true }));
const at = (name) => path.join(TMP, name);

section('1 — a layered config loader');
/* loadConfig({ defaults, file, env, argv }) merges four sources, each
 * overriding the one before:
 *   defaults  <  file contents  <  env vars  <  command-line args
 * env keys arrive prefixed and upper-cased: APP_PORT -> port.
 * argv is already parsed into an object.
 * Numeric-looking strings from env and argv become numbers.      */
function loadConfig({ defaults = {}, file = {}, env = {}, argv = {} } = {}) {
  // your code here
}
check('defaults only', loadConfig({ defaults: { port: 3000, host: 'localhost' } }),
  { port: 3000, host: 'localhost' });
check('file overrides defaults', loadConfig({ defaults: { port: 3000 }, file: { port: 4000 } }),
  { port: 4000 });
check('env overrides the file', loadConfig({
  defaults: { port: 3000 }, file: { port: 4000 }, env: { APP_PORT: '5000' },
}), { port: 5000 });
check('argv wins', loadConfig({
  defaults: { port: 3000 }, file: { port: 4000 }, env: { APP_PORT: '5000' }, argv: { port: '6000' },
}), { port: 6000 });
check('non-numeric strings stay strings', loadConfig({ env: { APP_HOST: 'db.internal' } }),
  { host: 'db.internal' });
check('unrelated env vars are ignored', loadConfig({ defaults: { a: 1 }, env: { PATH: '/usr/bin' } }),
  { a: 1 });

section('2 — a CLI');
/* runCli(argv, commands) where commands maps a name to a handler taking
 * the parsed { flags, options, positional }.
 * runCli(['build', '--out', 'dist'], cmds) calls cmds.build.
 * No command, or an unknown one, returns `unknown command: ${name}`
 * (or 'no command given' when argv is empty).                    */
function runCli(argv, commands) {
  // your code here
}
const CMDS = {
  build: ({ options }) => `building to ${options.out ?? 'build'}`,
  test: ({ flags }) => (flags.watch ? 'testing in watch mode' : 'testing once'),
};
check('with an option', runCli(['build', '--out', 'dist'], CMDS), 'building to dist');
check('equals form', runCli(['build', '--out=lib'], CMDS), 'building to lib');
check('default option', runCli(['build'], CMDS), 'building to build');
check('a flag', runCli(['test', '--watch'], CMDS), 'testing in watch mode');
check('no flag', runCli(['test'], CMDS), 'testing once');
check('unknown', runCli(['deploy'], CMDS), 'unknown command: deploy');
check('nothing', runCli([], CMDS), 'no command given');

section('3 — a dependency graph');
/* Given a map of module -> its imports, produce a BUILD ORDER where every
 * module comes after everything it depends on.
 * A cycle throws `circular dependency: ${name}`.                 */
function buildOrder(graph) {
  // your code here
}
check('simple chain', buildOrder({ app: ['utils'], utils: [] }), ['utils', 'app']);
check('diamond', buildOrder({
  app: ['left', 'right'], left: ['base'], right: ['base'], base: [],
}), ['base', 'left', 'right', 'app']);
check('already ordered', buildOrder({ a: [] }), ['a']);
check('cycle', () => {
  try { buildOrder({ a: ['b'], b: ['a'] }); return 'no throw'; } catch (e) { return e.message; }
}, 'circular dependency: a', buildOrder);

section('4 — finding a package root');
/* Walk UP from a starting folder until a package.json is found, exactly
 * like node's resolution.
 * findPackageRoot(start) returns the folder path, or null at the top.  */
async function findPackageRoot(start) {
  // your code here
}
checkAsync('finds it above', async () => {
  await fs.mkdir(at('proj/src/deep'), { recursive: true });
  await fs.writeFile(at('proj/package.json'), '{}');
  const found = await findPackageRoot(at('proj/src/deep'));
  return found === at('proj');
}, true, findPackageRoot);
checkAsync('finds it in the same folder', async () => {
  const found = await findPackageRoot(at('proj'));
  return found === at('proj');
}, true, findPackageRoot);
checkAsync('nothing above', async () => {
  await fs.mkdir(at('lonely'), { recursive: true });
  return await findPackageRoot(at('lonely'));
}, null, findPackageRoot);

section('5 — a tiny bundler');
/* Given a map of file -> source text, where a source may contain lines
 * like `require('./other')`, produce a single concatenated string in
 * dependency order, each file wrapped with a comment header.
 * bundle(files, entry) ->
 *   '// ./dep\nDEP SOURCE\n// ./entry\nENTRY SOURCE'             */
function bundle(files, entry) {
  // your code here
}
const FILES = {
  './entry': "require('./dep')\nconsole.log('entry')",
  './dep': "console.log('dep')",
};
check('ordered and wrapped', bundle(FILES, './entry'),
  "// ./dep\nconsole.log('dep')\n// ./entry\nrequire('./dep')\nconsole.log('entry')");
check('no dependencies', bundle({ './solo': 'x' }, './solo'), '// ./solo\nx');

section('6 — a file-based key/value store');
/* makeStore(file) with async get(key), set(key, value), delete(key) and
 * keys(). It persists to a JSON file and survives a reload.      */
function makeStore(file) {
  // your code here
}
checkAsync('set then get', async () => {
  const s = makeStore(at('store.json'));
  await s.set('a', 1);
  return await s.get('a');
}, 1, makeStore);
checkAsync('survives a reload', async () => {
  const first = makeStore(at('store2.json'));
  await first.set('name', 'Asha');
  const second = makeStore(at('store2.json'));
  return await second.get('name');
}, 'Asha', makeStore);
checkAsync('missing key', async () => await makeStore(at('store3.json')).get('nope'), null, makeStore);
checkAsync('delete', async () => {
  const s = makeStore(at('store4.json'));
  await s.set('a', 1);
  await s.delete('a');
  return await s.get('a');
}, null, makeStore);
checkAsync('keys are sorted', async () => {
  const s = makeStore(at('store5.json'));
  await s.set('b', 1);
  await s.set('a', 2);
  return await s.keys();
}, ['a', 'b'], makeStore);

section('7 — a change detector');
/* The core of a file watcher, without the watching.
 * diffSnapshots(before, after) compares two maps of path -> modified time
 * and returns { added, changed, removed }, each sorted.          */
function diffSnapshots(before, after) {
  // your code here
}
check('all three kinds', diffSnapshots(
  { 'a.js': 1, 'b.js': 1, 'c.js': 1 },
  { 'a.js': 1, 'b.js': 2, 'd.js': 1 },
), { added: ['d.js'], changed: ['b.js'], removed: ['c.js'] });
check('nothing changed', diffSnapshots({ 'a.js': 1 }, { 'a.js': 1 }),
  { added: [], changed: [], removed: [] });
check('from empty', diffSnapshots({}, { 'a.js': 1 }),
  { added: ['a.js'], changed: [], removed: [] });

section('8 — a folder size report');
/* sizeReport(root) walks the tree and returns
 *   { files: n, bytes: total, largest: relativePath }
 * largest is null for an empty folder.                           */
async function sizeReport(root) {
  // your code here
}
checkAsync('counts and measures', async () => {
  await fs.mkdir(at('sized/sub'), { recursive: true });
  await fs.writeFile(at('sized/small.txt'), 'ab');
  await fs.writeFile(at('sized/sub/big.txt'), 'abcdefghij');
  const r = await sizeReport(at('sized'));
  return [r.files, r.bytes, r.largest];
}, [2, 12, path.join('sub', 'big.txt')], sizeReport);
checkAsync('empty folder', async () => {
  await fs.mkdir(at('empty-dir'), { recursive: true });
  return await sizeReport(at('empty-dir'));
}, { files: 0, bytes: 0, largest: null }, sizeReport);

log('finished?', 'modules and Node — the topic that lets you ship something');
report();

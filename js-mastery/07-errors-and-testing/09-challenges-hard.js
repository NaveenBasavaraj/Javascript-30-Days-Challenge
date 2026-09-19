'use strict';
const { check, checkAsync, sleep, section, log, report } = require('../_helpers/check');

/* ============================================================================
 * ERRORS 09 — CHALLENGES, LEVEL 2 (final boss)
 *
 * Error handling, debugging tools and testing infrastructure, combined.
 * ==========================================================================*/

section('1 — a validation engine');
/* makeValidator(schema) where schema maps field -> array of rules.
 * A rule is { test: (value, all) => boolean, message }.
 * validate(object) returns { valid, errors } where errors maps field to
 * an array of messages. Only fields with problems appear.
 * Rules for a field stop at the FIRST failure.                   */
function makeValidator(schema) {
  // your code here
}
const required = { test: (v) => v !== undefined && v !== null && v !== '', message: 'is required' };
const isNumber = { test: (v) => typeof v === 'number', message: 'must be a number' };
const isAdult = { test: (v) => v >= 18, message: 'must be 18 or over' };
const matchesConfirm = { test: (v, all) => v === all.confirm, message: 'must match confirm' };

check('all valid', () => makeValidator({ age: [required, isNumber, isAdult] }).validate({ age: 30 }),
  { valid: true, errors: {} }, makeValidator);
check('stops at the first rule', () => makeValidator({ age: [required, isNumber, isAdult] }).validate({}),
  { valid: false, errors: { age: ['is required'] } }, makeValidator);
check('second rule', () => makeValidator({ age: [required, isNumber, isAdult] }).validate({ age: 'x' }),
  { valid: false, errors: { age: ['must be a number'] } }, makeValidator);
check('third rule', () => makeValidator({ age: [required, isNumber, isAdult] }).validate({ age: 10 }),
  { valid: false, errors: { age: ['must be 18 or over'] } }, makeValidator);
check('a rule can see the whole object', () => makeValidator({ password: [matchesConfirm] })
  .validate({ password: 'a', confirm: 'b' }),
{ valid: false, errors: { password: ['must match confirm'] } }, makeValidator);
check('several fields', () => makeValidator({ a: [required], b: [required] }).validate({}),
  { valid: false, errors: { a: ['is required'], b: ['is required'] } }, makeValidator);

section('2 — a retry policy with jitter-free backoff');
/* retryPolicy({ attempts, delays }) returns an async runner.
 * delays is an array of waits BETWEEN attempts (so length attempts - 1).
 * Resolve on the first success; reject with an AggregateError-like
 * object { message: 'all attempts failed', errors: [messages] }.  */
function retryPolicy({ attempts, delays }) {
  // your code here
}
checkAsync('succeeds on the second attempt', async () => {
  let n = 0;
  const run = retryPolicy({ attempts: 3, delays: [5, 5] });
  const value = await run(async () => { n++; if (n < 2) throw new Error('x'); return 'ok'; });
  return [value, n];
}, ['ok', 2], retryPolicy);
checkAsync('collects every error', async () => {
  const run = retryPolicy({ attempts: 3, delays: [2, 2] });
  let n = 0;
  try {
    await run(async () => { n++; throw new Error(`fail ${n}`); });
    return 'no error';
  } catch (e) {
    return [e.message, e.errors];
  }
}, ['all attempts failed', ['fail 1', 'fail 2', 'fail 3']], retryPolicy);
checkAsync('honours the delays', async () => {
  const run = retryPolicy({ attempts: 3, delays: [30, 30] });
  const start = Date.now();
  try { await run(async () => { throw new Error('x'); }); } catch { /* expected */ }
  return Date.now() - start >= 55;
}, true, retryPolicy);

section('3 — an error reporter');
/* makeReporter() collects errors and produces a grouped summary:
 *   report(error, context)  records it
 *   summary()  -> [{ name, count, messages, contexts }] sorted by count
 *                 descending, then by name
 * messages and contexts are deduplicated, in first-seen order.   */
function makeReporter() {
  // your code here
}
check('groups by error name', () => {
  const r = makeReporter();
  r.report(new TypeError('a'), 'load');
  r.report(new TypeError('a'), 'save');
  r.report(new RangeError('b'), 'load');
  return r.summary();
}, [
  { name: 'TypeError', count: 2, messages: ['a'], contexts: ['load', 'save'] },
  { name: 'RangeError', count: 1, messages: ['b'], contexts: ['load'] },
], makeReporter);
check('empty', () => makeReporter().summary(), [], makeReporter);
check('ties sort by name', () => {
  const r = makeReporter();
  r.report(new RangeError('x'), 'c');
  r.report(new TypeError('y'), 'c');
  return r.summary().map((s) => s.name);
}, ['RangeError', 'TypeError'], makeReporter);

section('4 — a minimal test framework');
/* createFramework() returns { describe, it, beforeEach, afterEach, run }.
 * • describes can NEST, and names join with ' > '
 * • beforeEach hooks apply to the current group AND its children,
 *   outermost first
 * • run() returns { passed, failed, failures: [{ name, message }] }  */
function createFramework() {
  // your code here
}
check('nested names', () => {
  const t = createFramework();
  t.describe('Cart', () => {
    t.describe('when empty', () => {
      t.it('has no items', () => {});
      t.it('throws on checkout', () => { throw new Error('nope'); });
    });
  });
  return t.run();
}, {
  passed: 1,
  failed: 1,
  failures: [{ name: 'Cart > when empty > throws on checkout', message: 'nope' }],
}, createFramework);
check('hooks run outermost first', () => {
  const t = createFramework();
  const log = [];
  t.describe('outer', () => {
    t.beforeEach(() => log.push('outer hook'));
    t.describe('inner', () => {
      t.beforeEach(() => log.push('inner hook'));
      t.it('test', () => log.push('test'));
    });
  });
  t.run();
  return log;
}, ['outer hook', 'inner hook', 'test'], createFramework);
check('a hook does not leak to a sibling group', () => {
  const t = createFramework();
  const log = [];
  t.describe('a', () => {
    t.beforeEach(() => log.push('a hook'));
    t.it('one', () => {});
  });
  t.describe('b', () => {
    t.it('two', () => {});
  });
  t.run();
  return log;
}, ['a hook'], createFramework);
check('afterEach runs even on failure', () => {
  const t = createFramework();
  const log = [];
  t.describe('g', () => {
    t.afterEach(() => log.push('cleanup'));
    t.it('fails', () => { throw new Error('x'); });
  });
  t.run();
  return log;
}, ['cleanup'], createFramework);

section('5 — a snapshot comparer');
/* diffValues(a, b, path) returns a list of differences as strings like
 *   'user.name: "Asha" != "Ben"'
 *   'user.age: missing in actual'
 *   'user.extra: missing in expected'
 * Walk nested plain objects and arrays. Sort the result.          */
function diffValues(actual, expected, path = '') {
  // your code here
}
check('identical', diffValues({ a: 1 }, { a: 1 }), []);
check('changed value', diffValues({ a: 1 }, { a: 2 }), ['a: 1 != 2']);
check('nested', diffValues({ u: { name: 'Asha' } }, { u: { name: 'Ben' } }),
  ['u.name: "Asha" != "Ben"']);
check('missing in actual', diffValues({}, { a: 1 }), ['a: missing in actual']);
check('missing in expected', diffValues({ a: 1 }, {}), ['a: missing in expected']);
check('arrays by index', diffValues([1, 2], [1, 3]), ['1: 2 != 3']);

section('6 — an async error aggregator');
/* runAllSafely(tasks) runs every async task in parallel and returns
 *   { values, errors }
 * where values holds the successes in original order and errors is
 * [{ index, message }]. It never rejects.                        */
async function runAllSafely(tasks) {
  // your code here
}
checkAsync('mixed', async () => await runAllSafely([
  async () => { await sleep(10); return 'a'; },
  async () => { throw new Error('bad'); },
  async () => 'c',
]), { values: ['a', 'c'], errors: [{ index: 1, message: 'bad' }] }, runAllSafely);
checkAsync('never rejects', async () => {
  const r = await runAllSafely([async () => { throw new Error('x'); }]);
  return r.errors.length;
}, 1, runAllSafely);
checkAsync('runs in parallel', async () => {
  const start = Date.now();
  await runAllSafely([async () => sleep(30), async () => sleep(30)]);
  return Date.now() - start < 55;
}, true, runAllSafely);

section('7 — a stack trace cleaner');
/* cleanStack(error, { keep }) returns the stack as an array of frames,
 * keeping only lines containing `keep`, and shortening each to
 * 'functionName (file:line)'.
 * A frame looks like '    at three (/a/b/file.js:31:24)'.        */
function cleanStack(error, { keep }) {
  // your code here
}
check('parses a synthetic stack', () => {
  const e = new Error('x');
  e.stack = [
    'Error: x',
    '    at inner (/app/src/thing.js:10:5)',
    '    at outer (/app/node_modules/lib/index.js:99:1)',
    '    at top (/app/src/main.js:3:9)',
  ].join('\n');
  return cleanStack(e, { keep: '/app/src/' });
}, ['inner (thing.js:10)', 'top (main.js:3)'], cleanStack);
check('nothing matches', () => {
  const e = new Error('x');
  e.stack = 'Error: x\n    at a (/other/f.js:1:1)';
  return cleanStack(e, { keep: '/app/' });
}, [], cleanStack);

section('8 — a property-based tester');
/* forAll(generator, property, runs) calls property(value) with `runs`
 * generated values and returns { passed: true } or, on the first
 * counterexample, { passed: false, counterexample, error }.
 * property returns a boolean or throws.                          */
function forAll(generator, property, runs) {
  // your code here
}
check('a true property', () => {
  let i = 0;
  return forAll(() => i++, (n) => n >= 0, 10);
}, { passed: true }, forAll);
check('finds a counterexample', () => {
  let i = 0;
  const r = forAll(() => i++, (n) => n < 3, 10);
  return [r.passed, r.counterexample];
}, [false, 3], forAll);
check('a throwing property', () => {
  const r = forAll(() => 'x', (s) => { throw new Error('boom'); }, 3);
  return [r.passed, r.error];
}, [false, 'boom'], forAll);

log('finished?', 'errors, debugging and testing — the topic that makes the other twelve safe');
report();

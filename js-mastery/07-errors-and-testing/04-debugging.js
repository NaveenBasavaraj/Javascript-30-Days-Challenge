'use strict';
const { check, section, log, report } = require('../_helpers/check');

/* ============================================================================
 * ERRORS 04 — DEBUGGING
 *
 * Debugging is not guessing. It is narrowing down where reality stops
 * matching your model, one halving at a time.
 *
 * THE METHOD
 *   1. REPRODUCE it reliably. A bug you cannot trigger you cannot fix.
 *   2. Write down what you EXPECT and what you OBSERVE. The gap is the bug.
 *   3. BISECT. Check the value halfway through. Is it right yet? Halve
 *      again. Ten halvings narrows a thousand lines to one.
 *   4. CHANGE ONE THING at a time.
 *
 * READING A STACK TRACE
 *   The TOP line is where it threw. The lines below are who called it.
 *   Your code is usually a few frames down, under library frames.
 *   `error.stack` is a string — you can split and filter it.
 *
 * THE CONSOLE IS MORE THAN log
 *   console.table(arrayOfObjects)    a real table
 *   console.dir(obj, { depth: null }) the whole nested structure
 *   console.time / timeEnd           how long something took
 *   console.trace()                  how did I get here?
 *   console.assert(cond, msg)        log only when the condition fails
 *   console.count(label)             how many times did this run?
 *
 * `debugger;` pauses execution when devtools or `node inspect` is
 * attached. It beats scattering log statements.
 * ==========================================================================*/

section('Exercise 1 — reading a stack trace');
/* stackDepth(error) returns how many `at ` frames the stack has.
 * Hint: split the stack on '\n' and count the lines that begin, once
 * trimmed, with 'at '.                                           */
function stackDepth(error) {
  // your code here
}
function three() { throw new Error('deep'); }
function two() { three(); }
function one() { two(); }
check('several frames', () => {
  try { one(); return 0; } catch (e) { return stackDepth(e) >= 3; }
}, true, stackDepth);

section('Exercise 2 — where did it throw?');
/* throwSite(error) returns the FUNCTION NAME from the top stack frame.
 * For the error thrown by three(), that is 'three'.
 * The first stack line after the message looks like:
 *   '    at three (/path/file.js:31:24)'                         */
function throwSite(error) {
  // your code here
}
check('names the function', () => {
  try { one(); return 'no error'; } catch (e) { return throwSite(e); }
}, 'three', throwSite);

section('Exercise 3 — keep only your own frames');
/* ownFrames(error, marker) returns the stack lines containing `marker`,
 * trimmed. Real projects filter out node_modules this way.       */
function ownFrames(error, marker) {
  // your code here
}
check('filters', () => {
  try { one(); return []; } catch (e) { return ownFrames(e, '07-errors-and-testing').length >= 3; }
}, true, ownFrames);
check('no matches', () => {
  try { one(); return null; } catch (e) { return ownFrames(e, 'zzz-not-here'); }
}, [], ownFrames);

section('Exercise 4 — bisecting');
/* A pipeline of four steps, one of which is wrong. Instead of staring at
 * it, instrument it.
 * traceSteps(input, steps) runs each step in turn and returns an array of
 * [stepIndex, valueAfterThatStep] pairs — the log you would print while
 * bisecting.                                                     */
function traceSteps(input, steps) {
  // your code here
}
const STEPS = [(n) => n + 1, (n) => n * 2, (n) => n - 3, (n) => n / 2];
check('every intermediate value', traceSteps(5, STEPS),
  [[0, 6], [1, 12], [2, 9], [3, 4.5]]);
check('no steps', traceSteps(5, []), []);

section('Exercise 5 — an assertion helper');
/* invariant(condition, message) throws new Error(`Invariant: ${message}`)
 * when the condition is falsy. Sprinkle these where you "know" something
 * is true — they turn a silent wrong answer into a loud stop.    */
function invariant(condition, message) {
  // your code here
}
check('passes', () => String(invariant(true, 'x')), 'undefined', invariant);
check('throws with a prefix', () => {
  try { invariant(false, 'list must not be empty'); return 'no throw'; } catch (e) { return e.message; }
}, 'Invariant: list must not be empty', invariant);

section('Exercise 6 — a counting instrument');
/* makeCounter() returns { count(label), report() } where report() gives
 * the tallies — the console.count pattern, in a form you can assert on. */
function makeCounter() {
  // your code here
}
check('tallies', () => {
  const c = makeCounter();
  c.count('hit'); c.count('miss'); c.count('hit');
  return c.report();
}, { hit: 2, miss: 1 });
check('starts empty', () => makeCounter().report(), {});

section('Exercise 7 — a timing instrument');
/* time(label, fn) runs fn, and returns { label, result, ms } where ms is
 * a number of milliseconds (use Date.now).                       */
function time(label, fn) {
  // your code here
}
check('reports', () => {
  const r = time('work', () => 6 * 7);
  return [r.label, r.result, typeof r.ms];
}, ['work', 42, 'number'], time);

section('Exercise 8 — logging without drowning');
/* makeLogger(level) returns { debug, info, error } where each pushes into
 * a shared array ONLY if it is at or above the configured level.
 * Levels in order: debug < info < error.
 * makeLogger('info').debug('x') is ignored.                      */
function makeLogger(level) {
  // your code here
}
check('info level hides debug', () => {
  const l = makeLogger('info');
  l.debug('d'); l.info('i'); l.error('e');
  return l.lines;
}, ['i', 'e']);
check('debug level shows everything', () => {
  const l = makeLogger('debug');
  l.debug('d'); l.error('e');
  return l.lines;
}, ['d', 'e']);
check('error level is quietest', () => {
  const l = makeLogger('error');
  l.debug('d'); l.info('i'); l.error('e');
  return l.lines;
}, ['e']);

section('Exercise 9 — a safe stringifier for logging');
/* JSON.stringify throws on circular data — bad in a logger.
 * safeStringify(value) returns JSON with circular references replaced by
 * the string '[Circular]'.                                       */
function safeStringify(value) {
  // your code here
}
check('normal', safeStringify({ a: 1, b: [2] }), '{"a":1,"b":[2]}');
check('circular', () => {
  const o = { name: 'x' };
  o.self = o;
  return safeStringify(o);
}, '{"name":"x","self":"[Circular]"}', safeStringify);

section('Exercise 10 — reproduce before you fix');
/* A bug report says "it crashes on some inputs". Find WHICH.
 * findFailing(fn, inputs) returns the inputs for which fn throws.  */
function findFailing(fn, inputs) {
  // your code here
}
check('finds them', findFailing((n) => {
  if (n === 0) throw new Error('divide by zero');
  return 10 / n;
}, [1, 0, 2, 0]), [0, 0]);
check('none', findFailing((n) => n, [1, 2]), []);

section('PREDICTIONS');

// P1: what type is error.stack?
let p1 = null;
check('P1  typeof new Error("x").stack', p1, typeof new Error('x').stack);

// P2: does the stack include the message?
let p2 = null;
check('P2  does the stack string start with the error name and message?', p2,
  new Error('boom').stack.startsWith('Error: boom'));

// P3: is console.log synchronous?
let p3 = null;
check('P3  does console.log return a value?', p3, String(console.log()));

// P4: does an object logged before mutation show the old or new values?
let p4 = null;
check('P4  in a browser console, logging an object then mutating it shows', p4, 'the new values');
log('why P4 matters', 'console keeps a live reference — log a copy, or JSON.stringify, to snapshot');

// P5: what does console.assert do when the condition is TRUE?
let p5 = null;
check('P5  console.assert(true, "msg")', p5, 'nothing');

report();

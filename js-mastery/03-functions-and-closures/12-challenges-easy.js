'use strict';
const { check, section, log, report } = require('../_helpers/check');

/* ============================================================================
 * FUNCTIONS 12 — CHALLENGES, LEVEL 1
 *
 * No new syntax. Files 01-11, combined.
 * ==========================================================================*/

section('1 — makeStepper');
/* makeStepper(10, 5) starts at 10 and adds 5 on each call.
 * First call returns 15.                                         */
function makeStepper(start, step) {
  // your code here
}
check('steps', () => { const s = makeStepper(10, 5); return [s(), s(), s()]; }, [15, 20, 25]);
check('independent', () => {
  const a = makeStepper(0, 1); const b = makeStepper(0, 100);
  a();
  return b();
}, 100);

section('2 — average of any arguments');
/* average(1, 2, 3) -> 2 ; average() -> 0                         */
function average(...nums) {
  // your code here
}
check('average', average(1, 2, 3), 2);
check('average none', average(), 0);

section('3 — makeValidator');
/* makeValidator(rules) returns a function that checks a value against
 * every rule and returns the messages that FAILED.
 * A rule is { test: fn, message: string }.                       */
function makeValidator(rules) {
  // your code here
}
const rules = [
  { test: (s) => s.length >= 3, message: 'too short' },
  { test: (s) => /[0-9]/.test(s), message: 'needs a digit' },
];
check('all pass', () => makeValidator(rules)('abc1'), []);
check('one fails', () => makeValidator(rules)('abc'), ['needs a digit']);
check('both fail', () => makeValidator(rules)('ab'), ['too short', 'needs a digit']);

section('4 — groupByFn');
/* groupByFn(['one','two','three'], w => w.length)
 *   -> { 3: ['one','two'], 5: ['three'] }                        */
function groupByFn(items, keyFn) {
  // your code here
}
check('groupByFn', groupByFn(['one', 'two', 'three'], (w) => w.length),
  { 3: ['one', 'two'], 5: ['three'] });

section('5 — makeIdGenerator');
/* makeIdGenerator('user') -> 'user-1', 'user-2', ...             */
function makeIdGenerator(prefix) {
  // your code here
}
check('ids', () => { const g = makeIdGenerator('user'); return [g(), g()]; }, ['user-1', 'user-2']);
check('separate counters', () => {
  const a = makeIdGenerator('a'); const b = makeIdGenerator('b');
  a(); a();
  return b();
}, 'b-1');

section('6 — rememberLast');
/* rememberLast(fn) -> [wrapped, getLast]. getLast() gives the most recent
 * result, or null before any call.                               */
function rememberLast(fn) {
  // your code here
}
check('remembers', () => {
  const [double, last] = rememberLast((n) => n * 2);
  double(2); double(5);
  return last();
}, 10);
check('starts null', () => {
  const [, last] = rememberLast((n) => n);
  return last();
}, null);

section('7 — makeBatcher');
/* makeBatcher(2) -> { push, flush }
 *   push(item) returns null until the batch is full, then returns the
 *              full batch and starts a new one
 *   flush()    returns whatever is left (possibly []) and clears it  */
function makeBatcher(size) {
  // your code here
}
check('fills', () => {
  const b = makeBatcher(2);
  return [b.push('a'), b.push('b')];
}, [null, ['a', 'b']]);
check('starts over', () => {
  const b = makeBatcher(2);
  b.push('a'); b.push('b');
  return [b.push('c'), b.flush()];
}, [null, ['c']]);
check('flush when empty', () => makeBatcher(2).flush(), []);

section('8 — negate and allOf');
/* Build isNotEmpty by NEGATING isEmpty — do not rewrite the logic.
 * allOf(...predicates) passes only when every one passes.        */
const isEmpty = (s) => s.length === 0;
function negate(fn) {
  // your code here
}
function allOf(...predicates) {
  // your code here
}
check('negate', () => ['', 'a'].filter(negate(isEmpty)), ['a']);
check('allOf', () => {
  const valid = allOf((n) => n > 0, (n) => n < 10, (n) => n % 2 === 0);
  return [1, 4, 12].filter(valid);
}, [4]);
check('allOf with no rules is always true', () => allOf()('anything'), true);

section('9 — repeat');
/* repeat(3, i => i * 2) -> [0, 2, 4]                             */
function repeat(times, fn) {
  // your code here
}
check('repeat', repeat(3, (i) => i * 2), [0, 2, 4]);
check('repeat none', repeat(0, (i) => i), []);

section('10 — a text-cleaning pipeline');
/* clean('  Hello   World  ') -> 'hello world'
 * Build it from small named steps and your own pipe, not one big
 * expression: trim, collapse repeated spaces, lowercase.         */
function pipe(...fns) {
  // your code here
}
function clean(text) {
  // your code here, using pipe
}
check('clean', clean('  Hello   World  '), 'hello world');
check('already clean', clean('ok'), 'ok');

section('11 — trackCalls');
/* trackCalls() -> { wrap, counts }
 *   wrap(name, fn) returns a wrapped fn that counts calls under that name
 *   counts() returns the tally object                            */
function trackCalls() {
  // your code here
}
check('tracks', () => {
  const t = trackCalls();
  const save = t.wrap('save', (x) => x);
  const load = t.wrap('load', (x) => x);
  save(1); save(2); load(1);
  return t.counts();
}, { save: 2, load: 1 });
check('starts empty', () => trackCalls().counts(), {});
check('the wrapper still returns the result', () => {
  const t = trackCalls();
  return t.wrap('x', (n) => n * 3)(4);
}, 12);

section('12 — makeQueue');
/* makeQueue() -> { add, next, size }
 *   add(item) returns the new size
 *   next()    removes and returns the oldest item, or null when empty
 * The internal array must not be reachable from outside.         */
function makeQueue() {
  // your code here
}
check('fifo order', () => {
  const q = makeQueue();
  q.add('a'); q.add('b');
  return [q.next(), q.next(), q.next()];
}, ['a', 'b', null]);
check('size', () => { const q = makeQueue(); q.add('a'); return q.size(); }, 1);
check('add returns the size', () => { const q = makeQueue(); q.add('a'); return q.add('b'); }, 2);
check('queue is private', () => Object.keys(makeQueue()).sort(), ['add', 'next', 'size']);

log('next', 'topic 03 ends with 13-challenges-hard.js — Redux, an event emitter and a trampoline');
report();

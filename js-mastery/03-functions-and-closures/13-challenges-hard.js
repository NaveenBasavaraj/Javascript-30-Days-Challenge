'use strict';
const { check, checkAsync, sleep, section, log, report } = require('../_helpers/check');

/* ============================================================================
 * FUNCTIONS 13 — CHALLENGES, LEVEL 2 (final boss)
 *
 * Each of these is a real library in miniature. If you can write these,
 * closures are yours.
 * ==========================================================================*/

section('1 — createStore (Redux in fifteen lines)');
/* createStore(reducer, initialState) -> { getState, dispatch, subscribe }
 *   dispatch(action)  runs the reducer, stores the result, notifies
 *                     every subscriber, and returns the action
 *   subscribe(fn)     returns an unsubscribe function
 * Subscribers are called with no arguments; they read getState themselves. */
function createStore(reducer, initialState) {
  // your code here
}
const counterReducer = (state, action) => {
  if (action.type === 'inc') return { count: state.count + 1 };
  if (action.type === 'add') return { count: state.count + action.by };
  return state;
};
check('initial state', () => createStore(counterReducer, { count: 0 }).getState(), { count: 0 });
check('dispatch updates', () => {
  const s = createStore(counterReducer, { count: 0 });
  s.dispatch({ type: 'inc' });
  s.dispatch({ type: 'add', by: 5 });
  return s.getState();
}, { count: 6 });
check('subscribers are notified', () => {
  const s = createStore(counterReducer, { count: 0 });
  const seen = [];
  s.subscribe(() => seen.push(s.getState().count));
  s.dispatch({ type: 'inc' });
  s.dispatch({ type: 'inc' });
  return seen;
}, [1, 2]);
check('unsubscribe works', () => {
  const s = createStore(counterReducer, { count: 0 });
  const seen = [];
  const off = s.subscribe(() => seen.push('x'));
  s.dispatch({ type: 'inc' });
  off();
  s.dispatch({ type: 'inc' });
  return seen.length;
}, 1);
check('two stores are independent', () => {
  const a = createStore(counterReducer, { count: 0 });
  const b = createStore(counterReducer, { count: 0 });
  a.dispatch({ type: 'inc' });
  return b.getState().count;
}, 0);

section('2 — createEmitter');
/* on(event, fn) -> an off function
 * emit(event, ...args) -> how many handlers ran
 * once(event, fn) -> fires at most once                          */
function createEmitter() {
  // your code here
}
check('on and emit', () => {
  const e = createEmitter();
  const seen = [];
  e.on('tick', (n) => seen.push(n));
  e.emit('tick', 1);
  e.emit('tick', 2);
  return seen;
}, [1, 2]);
check('emit returns the handler count', () => {
  const e = createEmitter();
  e.on('a', () => {});
  e.on('a', () => {});
  return e.emit('a');
}, 2);
check('unknown event is harmless', () => createEmitter().emit('nothing'), 0);
check('off stops it', () => {
  const e = createEmitter();
  const seen = [];
  const off = e.on('x', () => seen.push(1));
  e.emit('x');
  off();
  e.emit('x');
  return seen.length;
}, 1);
check('once', () => {
  const e = createEmitter();
  const seen = [];
  e.once('boot', () => seen.push('ran'));
  e.emit('boot'); e.emit('boot'); e.emit('boot');
  return seen;
}, ['ran']);
check('events do not cross', () => {
  const e = createEmitter();
  const seen = [];
  e.on('a', () => seen.push('a'));
  e.emit('b');
  return seen;
}, []);

section('3 — curry with a placeholder');
/* Use `_` to skip an argument and fill it in later.
 * const sub = curry((a, b) => a - b);
 * sub(_, 2)(10) -> 8        (10 - 2, not 2 - 10)                 */
const _ = Symbol('placeholder');
function curry(fn) {
  // your code here
}
check('normal currying still works', () => curry((a, b) => a - b)(10)(2), 8);
check('placeholder first', () => curry((a, b) => a - b)(_, 2)(10), 8);
check('three arguments', () => curry((a, b, c) => `${a}${b}${c}`)('a', _, 'c')('b'), 'abc');
check('all at once', () => curry((a, b) => a + b)(1, 2), 3);

section('4 — compose middleware (Express in miniature)');
/* Each middleware is (context, next) => { ... }. Running the stack calls
 * them in order; each one decides when to call next(). Code after next()
 * runs on the way back OUT.
 * runStack([...], { log: [] }) returns the context.               */
function runStack(middlewares, context) {
  // your code here
}
check('runs in order', () => {
  const ctx = { log: [] };
  runStack([
    (c, next) => { c.log.push('a in'); next(); c.log.push('a out'); },
    (c, next) => { c.log.push('b in'); next(); c.log.push('b out'); },
  ], ctx);
  return ctx.log;
}, ['a in', 'b in', 'b out', 'a out'], runStack);
check('a middleware can stop the chain', () => {
  const ctx = { log: [] };
  runStack([
    (c) => { c.log.push('stop here'); },
    (c) => { c.log.push('never'); },
  ], ctx);
  return ctx.log;
}, ['stop here'], runStack);
check('empty stack', () => runStack([], { log: [] }), { log: [] });

section('5 — deepMap');
/* Apply a function to every PRIMITIVE value in a nested structure,
 * preserving the shape. Arrays stay arrays, objects stay objects. */
function deepMap(value, fn) {
  // your code here
}
check('nested objects', deepMap({ a: 1, b: { c: 2 } }, (n) => n * 10), { a: 10, b: { c: 20 } });
check('arrays', deepMap([1, [2, [3]]], (n) => n + 1), [2, [3, [4]]]);
check('mixed', deepMap({ list: [1, { n: 2 }] }, (n) => n * 2), { list: [2, { n: 4 }] });
check('leaves the original alone', () => {
  const src = { a: { b: 1 } };
  deepMap(src, (n) => n * 99);
  return src;
}, { a: { b: 1 } }, deepMap);

section('6 — trampoline');
/* Deep recursion overflows the stack. A trampoline turns it into a loop:
 * the recursive function returns a FUNCTION to call next instead of
 * calling itself, and trampoline keeps invoking until it gets a value.
 *   const sum = (n, acc = 0) => n === 0 ? acc : () => sum(n - 1, acc + n);
 *   trampoline(sum)(100000) -> works, where plain recursion would not.  */
function trampoline(fn) {
  // your code here
}
const sumTo = (n, acc = 0) => (n === 0 ? acc : () => sumTo(n - 1, acc + n));
check('small', () => trampoline(sumTo)(5), 15);
check('deep enough to overflow a normal recursion', () => trampoline(sumTo)(100000), 5000050000);

section('7 — memoize with a size limit (LRU)');
/* Keep at most `max` entries. When full, drop the LEAST RECENTLY USED one.
 * Reading a key counts as using it.                              */
function memoizeLRU(fn, max) {
  // your code here
}
check('caches', () => {
  let calls = 0;
  const f = memoizeLRU((n) => { calls++; return n; }, 2);
  f(1); f(1);
  return calls;
}, 1);
check('evicts the oldest', () => {
  let calls = 0;
  const f = memoizeLRU((n) => { calls++; return n; }, 2);
  f(1); f(2); f(3);   // 1 is evicted
  f(1);               // so this recomputes
  return calls;
}, 4);
check('using a key keeps it alive', () => {
  let calls = 0;
  const f = memoizeLRU((n) => { calls++; return n; }, 2);
  f(1); f(2); f(1); f(3);   // 1 was used again, so 2 is evicted
  f(1);                     // still cached -> no new call
  return calls;
}, 3);

section('8 — a function that describes itself');
/* introspect(fn) -> { name, arity, isArrow }
 * An arrow function's source never starts with the word "function".  */
function introspect(fn) {
  // your code here
}
check('regular', introspect(function greet(a, b) {}), { name: 'greet', arity: 2, isArrow: false });
check('arrow', () => {
  const double = (n) => n * 2;
  return introspect(double);
}, { name: 'double', arity: 1, isArrow: true });

section('9 — pipeAsync (async)');
/* Like pipe, but every step may return a promise. Each step waits for the
 * previous one.                                                  */
function pipeAsync(...fns) {
  // your code here
}
checkAsync('awaits each step', async () => pipeAsync(
  (n) => n + 1,
  async (n) => { await sleep(5); return n * 2; },
  (n) => `= ${n}`,
)(4), '= 10', pipeAsync);
checkAsync('no functions', async () => pipeAsync()('x'), 'x', pipeAsync);

section('10 — debounce with leading and trailing (async)');
/* options: { leading, trailing }
 *   leading  -> fire immediately on the first call of a burst
 *   trailing -> fire once when the burst goes quiet
 * Both true: a burst fires twice (start and end); a SINGLE call fires once. */
function debounceAdvanced(fn, wait, { leading = false, trailing = true } = {}) {
  // your code here
}
checkAsync('trailing only (the default)', async () => {
  const seen = [];
  const f = debounceAdvanced((v) => seen.push(v), 30);
  f(1); f(2); f(3);
  await sleep(70);
  return seen;
}, [3], debounceAdvanced);
checkAsync('leading only', async () => {
  const seen = [];
  const f = debounceAdvanced((v) => seen.push(v), 30, { leading: true, trailing: false });
  f(1); f(2); f(3);
  await sleep(70);
  return seen;
}, [1], debounceAdvanced);
checkAsync('both, on a burst', async () => {
  const seen = [];
  const f = debounceAdvanced((v) => seen.push(v), 30, { leading: true, trailing: true });
  f(1); f(2); f(3);
  await sleep(70);
  return seen;
}, [1, 3], debounceAdvanced);
checkAsync('both, on a single call', async () => {
  const seen = [];
  const f = debounceAdvanced((v) => seen.push(v), 30, { leading: true, trailing: true });
  f('only');
  await sleep(70);
  return seen;
}, ['only'], debounceAdvanced);

log('if these all pass', 'you understand closures better than most working developers');
report();

'use strict';
const { check, section, log, report } = require('../_helpers/check');

/* ============================================================================
 * FUNCTIONS 08 — COMPOSITION, CURRYING & PARTIAL APPLICATION
 *
 * NOTES:
 *   COMPOSITION — build a big function by gluing small ones together.
 *     pipe(f, g)(x)     === g(f(x))     left to right, the readable order
 *     compose(f, g)(x)  === f(g(x))     right to left, the maths order
 *
 *   PARTIAL APPLICATION — lock in some arguments now, supply the rest later.
 *     const add = (a, b) => a + b;
 *     const add5 = partial(add, 5);     add5(3) -> 8
 *
 *   CURRYING — turn f(a, b, c) into f(a)(b)(c). Every call takes exactly
 *   one argument and returns a function until the last one.
 *     curry(add)(5)(3) -> 8
 *
 *   Why bother? Because every one of these produces a function you can hand
 *   straight to map/filter/sort without writing a wrapper arrow. Small,
 *   named, reusable pieces instead of one long inline callback.
 * ==========================================================================*/

const trim = (s) => s.trim();
const lower = (s) => s.toLowerCase();
const exclaim = (s) => `${s}!`;

section('Exercise 1 — pipe two functions');
/* pipe2(f, g) returns a function running f first, then g.
 * pipe2(trim, lower)('  HI  ') -> 'hi'                           */
function pipe2(f, g) {
  // your code here
}
check('pipe2', () => pipe2(trim, lower)('  HI  '), 'hi');

section('Exercise 2 — pipe any number');
/* pipe(...fns) -> left to right. pipe() with nothing returns the value.  */
function pipe(...fns) {
  // your code here
}
check('three deep', () => pipe(trim, lower, exclaim)('  HI  '), 'hi!');
check('one function', () => pipe(trim)('  x  '), 'x');
check('none', () => pipe()('unchanged'), 'unchanged');

section('Exercise 3 — compose');
/* Same, right to left: compose(exclaim, lower, trim)('  HI  ') -> 'hi!'  */
function compose(...fns) {
  // your code here
}
check('compose', () => compose(exclaim, lower, trim)('  HI  '), 'hi!');
check('compose is pipe reversed', () => compose(exclaim, lower)('HI'), 'hi!');

section('Exercise 4 — partial application');
/* partial(fn, ...locked) returns a function taking the remaining arguments.
 * partial((a, b, c) => a + b + c, 1, 2)(3) -> 6                  */
function partial(fn, ...locked) {
  // your code here
}
check('lock one', () => partial((a, b) => a + b, 5)(3), 8);
check('lock two', () => partial((a, b, c) => a + b + c, 1, 2)(3), 6);
check('lock none', () => partial((a, b) => a * b)(2, 3), 6);

section('Exercise 5 — partial from the right');
/* partialRight(fn, ...locked) locks the LAST arguments instead.
 * partialRight((a, b) => a - b, 1)(10) -> 9                      */
function partialRight(fn, ...locked) {
  // your code here
}
check('subtract one', () => partialRight((a, b) => a - b, 1)(10), 9);
check('order matters', () => partialRight((a, b, c) => `${a}${b}${c}`, 'b', 'c')('a'), 'abc');

section('Exercise 6 — curry a two-argument function');
/* curry2(fn)(a)(b) === fn(a, b)                                  */
function curry2(fn) {
  // your code here
}
check('curry2', () => curry2((a, b) => a + b)(2)(3), 5);
check('reusable first half', () => {
  const add = curry2((a, b) => a + b);
  const add10 = add(10);
  return [add10(1), add10(2)];
}, [11, 12]);

section('Exercise 7 — curry any arity');
/* curry(fn) collects arguments until it has fn.length of them, then runs.
 * It must accept them in ANY grouping:
 *   curried(1)(2)(3)  curried(1, 2)(3)  curried(1)(2, 3)  curried(1, 2, 3)  */
function curry(fn) {
  // your code here
}
const add3 = (a, b, c) => a + b + c;
check('one at a time', () => curry(add3)(1)(2)(3), 6);
check('two then one', () => curry(add3)(1, 2)(3), 6);
check('one then two', () => curry(add3)(1)(2, 3), 6);
check('all at once', () => curry(add3)(1, 2, 3), 6);
check('the partial is reusable', () => {
  const c = curry(add3);
  const from10 = c(10);
  return [from10(1)(1), from10(2)(2)];
}, [12, 14]);

section('Exercise 8 — a real pipeline');
/* slugify('  Hello World  ') -> 'hello-world'
 * Build it ONLY from pipe and these small steps — no new logic inline:
 *   trim, lower, then a step replacing spaces with dashes.       */
const dashes = (s) => s.split(' ').join('-');
function slugify(text) {
  // your code here: return pipe(...)(text)
}
check('slugify', slugify('  Hello World  '), 'hello-world');
check('already clean', slugify('one'), 'one');

section('Exercise 9 — composition with data-last functions');
/* These are curried so the DATA comes last — which is what makes them
 * composable. Write them.
 *   mapWith(fn)(array)
 *   filterWith(predicate)(array)
 *   reduceWith(reducer, start)(array)                            */
function mapWith(fn) {
  // your code here
}
function filterWith(predicate) {
  // your code here
}
function reduceWith(reducer, start) {
  // your code here
}
check('mapWith', () => mapWith((n) => n * 2)([1, 2]), [2, 4]);
check('filterWith', () => filterWith((n) => n > 1)([1, 2, 3]), [2, 3]);
check('reduceWith', () => reduceWith((a, b) => a + b, 0)([1, 2, 3]), 6);
check('composed together', () => pipe(
  filterWith((n) => n % 2 === 0),
  mapWith((n) => n * 10),
  reduceWith((a, b) => a + b, 0),
)([1, 2, 3, 4]), 60);

section('Exercise 10 — tap');
/* tap(fn) runs fn for its side effect and passes the value through
 * unchanged. Used to peek inside a pipeline without breaking it.  */
function tap(fn) {
  // your code here
}
check('passes through', () => {
  const seen = [];
  const result = pipe(trim, tap((v) => seen.push(v)), exclaim)('  hi  ');
  return [result, seen];
}, ['hi!', ['hi']]);

section('Exercise 11 — unary');
/* unary(fn) returns a function that passes ONLY the first argument on.
 * This is the real fix for the map(parseInt) trap.
 * ['1','2','3'].map(unary(parseInt)) -> [1, 2, 3]                */
function unary(fn) {
  // your code here
}
check('fixes parseInt', () => ['1', '2', '3'].map(unary(parseInt)), [1, 2, 3]);
check('ignores extra args', () => unary((a, b) => [a, b])(1, 2), [1, undefined]);

section('Exercise 12 — flip');
/* flip(fn) swaps the first two arguments.
 * flip((a, b) => `${a}${b}`)('x', 'y') -> 'yx'                   */
function flip(fn) {
  // your code here
}
check('flip', () => flip((a, b) => `${a}${b}`)('x', 'y'), 'yx');
check('flip a subtraction', () => flip((a, b) => a - b)(1, 10), 9);

section('PREDICTIONS');

// P1: order of a pipe
const shout = (s) => s.toUpperCase();
const wrap = (s) => `[${s}]`;
let p1 = null;
check('P1  [shout, wrap] applied left to right to "hi"', p1, wrap(shout('hi')));

// P2: the same two functions, composed right to left
let p2 = null;
check('P2  compose(shout, wrap)("hi")', p2, shout(wrap('hi')));

// P3: how many arguments does a curried function report?
function curried(a) { return (b) => a + b; }
let p3 = null;
check('P3  curried.length', p3, curried.length);

// P4: partial application does not change the original
const base = (a, b) => a + b;
const locked = base.bind(null, 5);
let p4 = null;
check('P4  base(1, 2) after creating `locked`', p4, base(1, 2));

// P5: bind is partial application built into the language
let p5 = null;
check('P5  base.bind(null, 5)(3)', p5, base.bind(null, 5)(3));

log('the payoff', 'small named functions + pipe reads top to bottom like a recipe');

report();

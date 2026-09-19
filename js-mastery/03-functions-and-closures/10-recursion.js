'use strict';
const { check, section, log, report } = require('../_helpers/check');

/* ============================================================================
 * FUNCTIONS 10 — RECURSION
 *
 * A recursive function calls itself on a SMALLER version of the problem
 * until it reaches a case small enough to answer directly.
 *
 * Every recursive function needs exactly two things:
 *   1. A BASE CASE that returns without recursing. Forget it and you get
 *      "Maximum call stack size exceeded".
 *   2. A step that moves GENUINELY closer to the base case.
 *
 * The shape is always the same:
 *   function solve(input) {
 *     if (isSmallEnough(input)) return answer;        // base case
 *     return combine(input, solve(smaller(input)));   // recursive case
 *   }
 *
 * Use it when the data is nested and you do not know how deep: trees,
 * folders, menus, JSON, the DOM. For flat lists a loop is usually clearer.
 *
 * JavaScript does NOT optimise tail calls (V8 never shipped it), so very
 * deep recursion will overflow the stack. Roughly 10,000 frames is the
 * practical ceiling — see P5.
 * ==========================================================================*/

section('Exercise 1 — countdown');
/* countdown(3) -> [3, 2, 1] ; countdown(0) -> []
 * No loops in this file unless a check says otherwise.           */
function countdown(n) {
  // your code here
}
check('countdown', countdown(3), [3, 2, 1]);
check('countdown 0', countdown(0), []);

section('Exercise 2 — factorial and sum');
/* factorial(5) -> 120 ; factorial(0) -> 1
 * sumTo(4) -> 10   (4 + 3 + 2 + 1)                               */
function factorial(n) {
  // your code here
}
function sumTo(n) {
  // your code here
}
check('factorial', factorial(5), 120);
check('factorial base', factorial(0), 1);
check('sumTo', sumTo(4), 10);
check('sumTo 0', sumTo(0), 0);

section('Exercise 3 — fibonacci');
/* fib(0) -> 0, fib(1) -> 1, fib(n) -> fib(n-1) + fib(n-2)
 * fib(10) -> 55                                                  */
function fib(n) {
  // your code here
}
check('fib 0', fib(0), 0);
check('fib 1', fib(1), 1);
check('fib 10', fib(10), 55);

section('Exercise 4 — the cost of naive recursion');
/* Same fibonacci, but count how many calls it makes. fib(20) naively
 * makes 21891 calls, because it recomputes the same values over and over.
 * Then write fibFast using a cache — the cache makes it instant.     */
let callCount = 0;
function fibCounted(n) {
  callCount++;
  // your code here: the same naive recursion, calling fibCounted
}
check('naive call count for fib(20)', () => {
  callCount = 0;
  fibCounted(20);
  return callCount;
}, 21891, fibCounted);

function fibFast(n, cache = new Map()) {
  // your code here
}
check('same answer', fibFast(30), 832040);
check('and it is instant', () => fibFast(60), 1548008755920);

section('Exercise 5 — reverse a string');
/* reverse('abc') -> 'cba'. Recursively: last character + reverse(rest).  */
function reverse(str) {
  // your code here
}
check('reverse', reverse('abc'), 'cba');
check('reverse empty', reverse(''), '');
check('reverse one', reverse('x'), 'x');

section('Exercise 6 — flatten a nested array');
/* flatten([1, [2, [3, [4]]]]) -> [1, 2, 3, 4]
 * This is the classic case where recursion beats a loop: you do not know
 * how deep it goes.                                              */
function flatten(arr) {
  // your code here
}
check('flatten', flatten([1, [2, [3, [4]]]]), [1, 2, 3, 4]);
check('flatten flat', flatten([1, 2]), [1, 2]);
check('flatten empty', flatten([]), []);

section('Exercise 7 — walk a tree');
/* A node is { name, children: [] }.
 * allNames(tree) -> every name, parents before children, depth first. */
const TREE = {
  name: 'root',
  children: [
    { name: 'a', children: [{ name: 'a1', children: [] }] },
    { name: 'b', children: [] },
  ],
};
function allNames(node) {
  // your code here
}
check('allNames', allNames(TREE), ['root', 'a', 'a1', 'b']);

section('Exercise 8 — depth of a tree');
/* A leaf is depth 1. TREE is depth 3.                            */
function depth(node) {
  // your code here
}
check('depth', depth(TREE), 3);
check('leaf', depth({ name: 'x', children: [] }), 1);

section('Exercise 9 — find in a tree');
/* findNode(TREE, 'a1') -> the a1 node, or null.
 * Return as soon as it is found.                                 */
function findNode(node, name) {
  // your code here
}
check('found deep', () => findNode(TREE, 'a1').name, 'a1');
check('found shallow', () => findNode(TREE, 'b').name, 'b');
check('missing', findNode(TREE, 'zzz'), null);

section('Exercise 10 — sum a nested object');
/* Add every number at any depth.
 * deepSum({ a: 1, b: { c: 2, d: { e: 3 } } }) -> 6
 * Non-numbers are ignored.                                       */
function deepSum(obj) {
  // your code here
}
check('deepSum', deepSum({ a: 1, b: { c: 2, d: { e: 3 } } }), 6);
check('ignores strings', deepSum({ a: 1, b: 'two' }), 1);
check('empty', deepSum({}), 0);

section('Exercise 11 — an accumulator parameter');
/* Some recursions are cleaner when you carry the answer down instead of
 * building it on the way back up.
 * joinPath(['a','b','c']) -> 'a/b/c'
 * Write it with a second parameter that defaults to ''.          */
function joinPath(parts, acc = '') {
  // your code here
}
check('joinPath', joinPath(['a', 'b', 'c']), 'a/b/c');
check('joinPath one', joinPath(['a']), 'a');
check('joinPath none', joinPath([]), '');

section('Exercise 12 — mutual recursion');
/* Two functions that call each other.
 * isEven(4) -> true, isOdd(3) -> true
 * Rules: 0 is even; otherwise isEven(n) is isOdd(n - 1).         */
function isEven(n) {
  // your code here
}
function isOdd(n) {
  // your code here
}
check('isEven', isEven(4), true);
check('isOdd', isOdd(3), true);
check('isEven 0', isEven(0), true);
check('isOdd 0', isOdd(0), false);

section('Exercise 13 — binary search');
/* The array is sorted. Return the index, or -1. Halve the range each time.
 * search([1,3,5,7,9], 7) -> 3                                    */
function search(sorted, target, low = 0, high = sorted.length - 1) {
  // your code here
}
check('middle', search([1, 3, 5, 7, 9], 5), 2);
check('later', search([1, 3, 5, 7, 9], 7), 3);
check('first', search([1, 3, 5, 7, 9], 1), 0);
check('missing', search([1, 3, 5], 4), -1);
check('empty', search([], 1), -1);

section('Exercise 14 — permutations');
/* All orderings of an array. permute([1,2,3]) has 6 entries.     */
function permute(arr) {
  // your code here
}
check('count', () => permute([1, 2, 3]).length, 6);
check('contents', () => permute([1, 2, 3]).map((p) => p.join('')).sort(),
  ['123', '132', '213', '231', '312', '321']);
check('single', permute([1]), [[1]]);
check('empty', permute([]), [[]]);

section('PREDICTIONS');

// P1: what happens with no base case?
function noBase(n) { return noBase(n + 1); }
let outcome1;
try { outcome1 = noBase(0); } catch (e) { outcome1 = e.constructor.name; }
let p1 = null;
check('P1  a recursion with no base case', p1, outcome1);

// P2: the error message for that
let message2;
try { noBase(0); } catch (e) { message2 = e.message; }
let p2 = null;
check('P2  its message', p2, message2);

// P3: how many calls does naive fib(5) make?
let count3 = 0;
function fib3(n) { count3++; return n < 2 ? n : fib3(n - 1) + fib3(n - 2); }
fib3(5);
let p3 = null;
check('P3  calls for naive fib(5)', p3, count3);

// P4: does the stack unwind before or after the recursive call returns?
const order4 = [];
function walk(n) {
  if (n === 0) return;
  order4.push(`down ${n}`);
  walk(n - 1);
  order4.push(`up ${n}`);
}
walk(2);
let p4 = null;
check('P4  order4', p4, order4);

// P5: roughly how deep can it go before overflowing?
function depthTest(n) { try { return depthTest(n + 1); } catch { return n; } }
const maxDepth = depthTest(0);
let p5 = null;              // guess: 100, 1000, 10000 or 1000000 — nearest
check('P5  the stack limit, rounded down to a power of ten', p5,
  10 ** Math.floor(Math.log10(maxDepth)));
log('actual stack depth reached here', maxDepth);

report();

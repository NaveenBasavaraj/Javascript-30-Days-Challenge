'use strict';
const { check, section, log, report } = require('../_helpers/check');

/* ============================================================================
 * FUNCTIONS 03 — RETURN VALUES & FUNCTION DESIGN
 *
 * NOTES:
 *   Every function returns something. With no `return`, that something is
 *   undefined. `return` also STOPS the function immediately.
 *
 *   GUARD CLAUSE — handle the awkward cases first and leave early, so the
 *   main logic is never buried inside nested ifs:
 *     if (!user) return null;
 *     if (!user.active) return null;
 *     ...the real work, unindented...
 *
 *   PURE FUNCTION — same input always gives the same output, and it touches
 *   nothing outside itself (no mutation of its arguments, no globals, no
 *   console, no Date.now(), no randomness). Pure functions are the ones you
 *   can test, cache and reorder safely. Most of this course is pure.
 *
 *   Returning a TUPLE (array) or a RECORD (object) is how you return more
 *   than one thing:
 *     return [value, error];      return { ok: true, value };
 *
 *   `return` followed by a newline is a trap — see P3.
 * ==========================================================================*/

section('Exercise 1 — a function with no return');
/* logAndForget should do something but return nothing.
 * Leave the body doing an assignment only; the point is the return value. */
let sideEffect = 0;
function logAndForget(n) {
  // your code here: set sideEffect to n, and return nothing at all
}
check('returns undefined', () => String(logAndForget(5)), 'undefined', logAndForget);
check('but it did run', () => { logAndForget(7); return sideEffect; }, 7, logAndForget);

section('Exercise 2 — return stops everything');
/* firstTruthy returns the first truthy value, or null.
 * It must STOP at the first one — the counter proves it.
 * firstTruthy([0, '', 'found', 'later']) -> 'found'              */
let inspected = 0;
function firstTruthy(values) {
  // your code here: increment `inspected` once per value you look at
}
check('found', () => { inspected = 0; return firstTruthy([0, '', 'found', 'later']); }, 'found');
check('stopped early', () => { inspected = 0; firstTruthy([0, '', 'found', 'later']); return inspected; }, 3, firstTruthy);
check('none', firstTruthy([0, '']), null);

section('Exercise 3 — guard clauses');
/* Rewrite this deeply nested logic with early returns. Return the user's
 * city, or one of these strings:
 *   no user      -> 'no user'
 *   not active   -> 'inactive'
 *   no address   -> 'no address'
 * discountCity({ active: true, address: { city: 'Pune' } }) -> 'Pune'  */
function cityOrReason(user) {
  // your code here — four returns, no nesting
}
check('happy path', cityOrReason({ active: true, address: { city: 'Pune' } }), 'Pune');
check('no user', cityOrReason(null), 'no user');
check('inactive', cityOrReason({ active: false }), 'inactive');
check('no address', cityOrReason({ active: true }), 'no address');

section('Exercise 4 — returning a tuple');
/* Return [value, error]. Exactly one of them is non-null.
 * divide(10, 2) -> [5, null]
 * divide(1, 0)  -> [null, 'cannot divide by zero']               */
function divide(a, b) {
  // your code here
}
check('ok', divide(10, 2), [5, null]);
check('error', divide(1, 0), [null, 'cannot divide by zero']);

section('Exercise 5 — returning a record');
/* Same idea, self-describing shape.
 * parseAge('30') -> { ok: true, value: 30 }
 * parseAge('abc') -> { ok: false, error: 'not a number' }
 * parseAge('-1') -> { ok: false, error: 'must be positive' }
 * Hint: Number('abc') is NaN — test with Number.isNaN.           */
function parseAge(text) {
  // your code here
}
check('ok', parseAge('30'), { ok: true, value: 30 });
check('not a number', parseAge('abc'), { ok: false, error: 'not a number' });
check('negative', parseAge('-1'), { ok: false, error: 'must be positive' });

section('Exercise 6 — pure vs impure');
/* `total` below is a global. Write BOTH versions:
 *   addImpure(n)  adds n to the global `total` and returns it
 *   addPure(runningTotal, n)  returns the new total, touching nothing   */
let total = 0;
function addImpure(n) {
  // your code here
}
function addPure(runningTotal, n) {
  // your code here
}
check('impure accumulates', () => { total = 0; addImpure(2); return addImpure(3); }, 5);
check('impure changed the global', () => { total = 0; addImpure(4); return total; }, 4, addImpure);
check('pure returns', addPure(2, 3), 5);
check('pure left the global alone', () => { total = 0; addPure(2, 3); return total; }, 0, addPure);

section('Exercise 7 — make this one pure');
/* The mission: same behaviour as sorting in place, but the caller's array
 * must survive. Return the sorted copy.
 * pureSort([3,1,2]) -> [1,2,3]                                   */
function pureSort(nums) {
  // your code here
}
const src7 = [3, 1, 2];
check('sorted', pureSort(src7), [1, 2, 3]);
check('input survived', src7, [3, 1, 2]);

section('Exercise 8 — returning early from a loop');
/* findIndexOf(arr, target) without using indexOf or findIndex.
 * Return the index, or -1.                                       */
function findIndexOf(arr, target) {
  // your code here
}
check('found', findIndexOf(['a', 'b', 'c'], 'b'), 1);
check('missing', findIndexOf(['a'], 'z'), -1);
check('first match wins', findIndexOf(['a', 'b', 'a'], 'a'), 0);

section('Exercise 9 — a function returning a function returning a value');
/* Three levels. between(1, 10)(5) -> true
 * between(1, 10) returns a tester for that range.                */
function between(min, max) {
  // your code here
}
check('inside', () => between(1, 10)(5), true);
check('outside', () => between(1, 10)(50), false);
check('inclusive ends', () => [between(1, 10)(1), between(1, 10)(10)], [true, true]);

section('Exercise 10 — chaining on the return value');
/* Return an object with methods that each return `this`, ending in a
 * value. Build a tiny query:
 *   query().where('a').where('b').build() -> 'WHERE a AND b'
 *   query().build() -> 'WHERE 1'                                 */
function query() {
  // your code here
}
check('two conditions', () => query().where('a').where('b').build(), 'WHERE a AND b');
check('none', () => query().build(), 'WHERE 1');

section('PREDICTIONS');

// P1: no return statement
function noReturn() { 1 + 1; }
let p1 = null;
check('P1  String(noReturn())', p1, String(noReturn()));

// P2: a bare `return`
function bareReturn() { return; }
let p2 = null;
check('P2  String(bareReturn())', p2, String(bareReturn()));

// P3: the newline trap — automatic semicolon insertion
function brokenReturn() {
  return
  { value: 42 };
}
let p3 = null;
check('P3  String(brokenReturn())', p3, String(brokenReturn()));

// P4: does code after a return ever run?
let ran = false;
function afterReturn() { return 1; ran = true; }
afterReturn();
let p4 = null;
check('P4  ran, after calling afterReturn()', p4, ran);

// P5: returning the result of an assignment
function assignReturn() { let x; return (x = 5); }
let p5 = null;
check('P5  assignReturn()', p5, assignReturn());

log('style note', 'guard clauses first, real work last, one level of indentation');

report();

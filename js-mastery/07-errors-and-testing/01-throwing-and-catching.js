'use strict';
const { check, section, log, report } = require('../_helpers/check');

/* ============================================================================
 * ERRORS 01 — THROWING & CATCHING
 * Run with:  node 07-errors-and-testing/01-throwing-and-catching.js
 *
 * NOTES:
 *   throw value            stops the function immediately and unwinds the
 *                          call stack until something catches it
 *   try { } catch (e) { }  catches anything thrown inside the try block
 *   catch { }              the binding is optional when you do not need it
 *   finally { }            ALWAYS runs — after try, after catch, and even
 *                          after a return
 *
 * THROW ERRORS, NOT STRINGS. `throw 'oops'` is legal and awful: no stack
 * trace, no name, and `e.message` is undefined. Always `throw new Error(...)`.
 *
 * WHAT CATCH CANNOT DO
 *   • It cannot catch anything thrown LATER (in a timer or callback).
 *   • It cannot catch a syntax error in the same file.
 *   • It does not stop a rejected promise unless you `await` it.
 *
 * THE BUILT-IN ERROR TYPES worth recognising:
 *   TypeError       wrong type — reading a property of undefined
 *   ReferenceError  a name that does not exist
 *   RangeError      a number out of range, or infinite recursion
 *   SyntaxError     invalid code or invalid JSON
 * ==========================================================================*/

section('Exercise 1 — throw and catch');
/* risky(shouldThrow) throws new Error('failed') when told to, otherwise
 * returns 'ok'. attempt(shouldThrow) calls it and returns either the
 * value or the caught message.                                   */
function risky(shouldThrow) {
  // your code here
}
function attempt(shouldThrow) {
  // your code here
}
check('success', attempt(false), 'ok');
check('caught', attempt(true), 'failed');

section('Exercise 2 — throw stops everything after it');
/* stopsHere(log) pushes 'before', throws, then pushes 'after' (which can
 * never run). Catch it and return the log.
 * -> ['before', 'caught']                                        */
function stopsHere() {
  // your code here
}
check('unreachable code', stopsHere(), ['before', 'caught']);

section('Exercise 3 — finally always runs');
/* order(mode) returns the blocks that ran, where mode is
 *   'ok'    -> ['try', 'finally']
 *   'throw' -> ['try', 'catch', 'finally']                       */
function order(mode) {
  // your code here
}
check('no error', order('ok'), ['try', 'finally']);
check('error', order('throw'), ['try', 'catch', 'finally']);

section('Exercise 4 — finally runs even after return');
/* returnsEarly(log) returns 'value' from inside the try, but the finally
 * still pushes 'cleanup' into the array it was given.
 * Return [returnedValue, log].                                   */
function returnsEarly() {
  // your code here
}
check('cleanup still happened', returnsEarly(), ['value', ['cleanup']]);

section('Exercise 5 — the error object');
/* describe(fn) runs fn and returns { name, message } of whatever it
 * throws, or null if it does not throw.                          */
function describeError(fn) {
  // your code here
}
check('a TypeError', describeError(() => null.x), { name: 'TypeError', message: "Cannot read properties of null (reading 'x')" });
check('a custom error', describeError(() => { throw new Error('mine'); }), { name: 'Error', message: 'mine' });
check('no error', describeError(() => 1), null);

section('Exercise 6 — never throw a string');
/* Two functions, so you can feel the difference.
 * throwsString() throws the string 'oops'.
 * inspect(fn) returns [typeof thrown, String(thrown.message)].   */
function throwsString() {
  // your code here
}
function inspect(fn) {
  // your code here
}
check('a thrown string has no message', inspect(throwsString), ['string', 'undefined']);
check('a thrown Error does', inspect(() => { throw new Error('good'); }), ['object', 'good']);
log('the rule', 'always throw new Error(...) — you lose the stack trace otherwise');

section('Exercise 7 — catch cannot reach a later callback');
/* tooLate() wraps a setTimeout in try/catch. The callback throws, but
 * the catch never fires, so it returns 'not caught'.             */
function tooLate() {
  // your code here
}
check('the catch is already over', tooLate(), 'not caught', tooLate);
process.once('uncaughtException', () => { /* the deliberate throw above */ });

section('Exercise 8 — rethrowing what you cannot handle');
/* handleOrRethrow(fn) catches the error. If its message contains
 * 'recoverable', return 'handled'. Anything else is rethrown untouched. */
function handleOrRethrow(fn) {
  // your code here
}
check('handled', handleOrRethrow(() => { throw new Error('recoverable glitch'); }), 'handled');
check('rethrown', () => {
  try {
    handleOrRethrow(() => { throw new Error('fatal'); });
    return 'no rethrow';
  } catch (e) { return e.message; }
}, 'fatal', handleOrRethrow);

section('Exercise 9 — nested try blocks');
/* The inner catch handles it first. Only what it rethrows reaches the
 * outer one.
 * nested(rethrow) -> ['inner', 'outer'] when it rethrows,
 *                    ['inner'] when it does not.                 */
function nested(rethrow) {
  // your code here
}
check('handled inside', nested(false), ['inner']);
check('passed outward', nested(true), ['inner', 'outer']);

section('Exercise 10 — guard clauses beat try/catch');
/* Validate first instead of catching afterwards.
 * safeDivide(a, b) returns null for a zero divisor or a non-number
 * argument, without any try/catch at all.                        */
function safeDivide(a, b) {
  // your code here
}
check('normal', safeDivide(10, 2), 5);
check('zero divisor', safeDivide(1, 0), null);
check('not a number', safeDivide('x', 2), null);
check('NaN is rejected too', safeDivide(NaN, 2), null);

section('PREDICTIONS — guess before you run');

// P1: what does catch receive when you throw a number?
let caught1;
try { throw 42; } catch (e) { caught1 = typeof e; }
let p1 = null;
check('P1  typeof what catch receives for `throw 42`', p1, caught1);

// P2: does finally override a returned value?
function p2f() {
  try { return 'from try'; } finally { /* no return here */ }
}
let p2 = null;
check('P2  p2f()', p2, p2f());

// P3: and if finally DOES return?
function p3f() {
  try { return 'from try'; } finally { return 'from finally'; } // eslint-disable-line no-unsafe-finally
}
let p3 = null;
check('P3  p3f()', p3, p3f());

// P4: is an error still an object?
let p4 = null;
check('P4  new Error("x") instanceof Object', p4, new Error('x') instanceof Object);

// P5: what type is a missing variable?
let caught5;
try { notDefinedAnywhere; } catch (e) { caught5 = e.constructor.name; } // eslint-disable-line no-undef
let p5 = null;
check('P5  reading an undeclared variable throws a', p5, caught5);

// P6: and calling a non-function?
let caught6;
try { const n = 5; n(); } catch (e) { caught6 = e.constructor.name; }
let p6 = null;
check('P6  calling a number throws a', p6, caught6);

// P7: infinite recursion
function p7f() { return p7f(); }
let caught7;
try { p7f(); } catch (e) { caught7 = e.constructor.name; }
let p7 = null;
check('P7  infinite recursion throws a', p7, caught7);

report();

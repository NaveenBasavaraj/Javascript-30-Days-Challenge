'use strict';
const { check, section, log, report } = require('../_helpers/check');

/* ============================================================================
 * FUNCTIONS 01 — THE FOUR WAYS TO MAKE A FUNCTION
 * Run with:  node 03-functions-and-closures/01-declaring-functions.js
 *
 * NOTES:
 *   DECLARATION        function add(a, b) { return a + b; }
 *       Hoisted completely — you can call it ABOVE where it is written.
 *
 *   EXPRESSION         const add = function (a, b) { return a + b; };
 *       The variable is hoisted but not the value, so calling it early
 *       throws ReferenceError (see P2).
 *
 *   ARROW              const add = (a, b) => a + b;
 *       Shortest. No `this`, no `arguments`, cannot be a constructor.
 *       ONE expression = implicit return. Add braces and you must `return`.
 *
 *   METHOD SHORTHAND   const obj = { add(a, b) { return a + b; } };
 *
 *   A function is a VALUE. It can be stored, passed and returned like a
 *   number. That single fact is what the rest of this topic is built on.
 *
 *   Arrow bodies:
 *     x => x * 2            returns x * 2
 *     x => { x * 2; }       returns undefined   <- the classic slip
 *     x => ({ v: x })       an object literal needs wrapping parentheses
 * ==========================================================================*/

section('Exercise 1 — three shapes of the same function');
/* Write `double` three times, each in a different style.
 * All three must return n * 2.                                   */
function doubleDeclaration(n) {
  // your code here (function declaration body)
}
const doubleExpression = function (n) {
  // your code here
};
const doubleArrow = (n) => {
  // your code here
};
check('declaration', doubleDeclaration(4), 8);
check('expression', doubleExpression(4), 8);
check('arrow', doubleArrow(4), 8);

section('Exercise 2 — implicit return');
/* Rewrite the arrow with NO braces and NO `return` keyword.
 * It must still be a single expression.                          */
const triple = (n) => 0; // replace the 0 with the real expression
check('triple', triple(3), 9);

section('Exercise 3 — returning an object literal');
/* toPoint(1, 2) -> { x: 1, y: 2 }
 * Write it as an ARROW with an implicit return. You will need the
 * wrapping parentheses: (x, y) => ({ ... })                      */
const toPoint = (x, y) => null; // replace null
check('toPoint', toPoint(1, 2), { x: 1, y: 2 });

section('Exercise 4 — a function is a value');
/* Store, pass and call. applyTwice(fn, value) runs fn on value twice.
 * applyTwice(n => n + 3, 1) -> 7                                 */
function applyTwice(fn, value) {
  // your code here
}
check('applyTwice add', applyTwice((n) => n + 3, 1), 7);
check('applyTwice upper', applyTwice((s) => s + '!', 'hi'), 'hi!!');

section('Exercise 5 — returning a function');
/* adder(5) returns a FUNCTION that adds 5 to whatever it is given.
 * adder(5)(3) -> 8
 * This is your first closure, though we will not name it until file 05. */
function adder(n) {
  // your code here
}
check('adder', () => adder(5)(3), 8);
check('independent adders', () => [adder(1)(10), adder(2)(10)], [11, 12]);

section('Exercise 6 — named function expressions');
/* Give the function expression its OWN name `fact` so it can call itself,
 * even though the outer variable is called `factorial`.
 * factorial(5) -> 120
 * Hint: const factorial = function fact(n) { ... fact(n - 1) ... };
 * The name `fact` is visible ONLY inside the function body.      */
const factorial = function (n) {
  // your code here
};
check('factorial', factorial(5), 120);
check('factorial 0', factorial(0), 1);

section('Exercise 7 — IIFE');
/* An Immediately Invoked Function Expression runs the moment it is
 * defined, and keeps its variables out of the surrounding scope.
 *   const x = (function () { ... })();
 * Make `secretSum` equal 6 by running an IIFE that adds 1 + 2 + 3
 * inside itself. No helper variables outside it.                 */
const secretSum = null; // replace with an IIFE
check('secretSum', secretSum, 6);

section('Exercise 8 — arity and .name');
/* Every function knows how many parameters it declares (fn.length)
 * and what it is called (fn.name).
 * describeFn(function greet(a, b) {}) -> 'greet takes 2'         */
function describeFn(fn) {
  // your code here
}
check('describeFn', describeFn(function greet(a, b) {}), 'greet takes 2');
const identity = (x) => x;   // an arrow assigned to a const borrows its name
check('describeFn arrow', describeFn(identity), 'identity takes 1');

section('Exercise 9 — default vs missing');
/* greet() -> 'Hello, friend'
 * greet('Asha') -> 'Hello, Asha'
 * Use a default parameter, not an if statement.                  */
function greet(name = 'friend') {
  // your code here
}
check('with a name', greet('Asha'), 'Hello, Asha');
check('no argument', greet(), 'Hello, friend');
check('explicit undefined still defaults', greet(undefined), 'Hello, friend');

section('Exercise 10 — a function that builds functions');
/* multiplier(3) -> a function that multiplies by 3.
 * Then build `triple3` and `half` from it.
 * multiplier(0.5)(8) -> 4                                        */
const multiplier = (factor) => null; // replace null
check('by 3', () => multiplier(3)(4), 12);
check('by half', () => multiplier(0.5)(8), 4);

section('PREDICTIONS — guess before you run');

// P1: calling a DECLARATION before it is written
let p1 = null;
let outcome1;
try { outcome1 = hoisted(); } catch (e) { outcome1 = e.constructor.name; }
function hoisted() { return 'works'; }
check('P1  calling hoisted() above its declaration', p1, outcome1);

// P2: calling an EXPRESSION before it is written
let outcome2;
try { outcome2 = notHoisted(); } catch (e) { outcome2 = e.constructor.name; }
const notHoisted = function () { return 'works'; };
let p2 = null;
check('P2  calling notHoisted() above its assignment', p2, outcome2);

// P3: braces without a return
const p3fn = (x) => { x * 2; };
let p3 = null;
check('P3  String(((x) => { x * 2; })(5))', p3, String(p3fn(5)));

// P4: typeof a function
let p4 = null;
check('P4  typeof function () {}', p4, typeof function () {});

// P5: what is the .name of an arrow assigned to a const?
const namedArrow = () => {};
let p5 = null;
check('P5  namedArrow.name', p5, namedArrow.name);

// P6: does fn.length count parameters with defaults?
function withDefault(a, b = 1, c) {}
let p6 = null;
check('P6  withDefault.length', p6, withDefault.length);

log('remember', 'a function is just a value that happens to be callable');

report();

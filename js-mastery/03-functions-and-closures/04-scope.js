'use strict';
const { check, section, log, report } = require('../_helpers/check');

/* ============================================================================
 * FUNCTIONS 04 — SCOPE
 *
 * Scope answers one question: "which variables can this line see?"
 *
 * NOTES:
 *   THREE SCOPES
 *     global      declared outside everything
 *     function    every `function` body makes one
 *     block       every { } makes one — but only for let and const
 *
 *   var   is function-scoped. It leaks out of if/for blocks.
 *   let   is block-scoped and can be reassigned.
 *   const is block-scoped and cannot be REASSIGNED (its contents can still
 *         change — const on an object does not freeze it).
 *
 *   THE SCOPE CHAIN — an inner scope can read outward, never inward.
 *   Lookup walks outward until it finds the name or runs out.
 *
 *   SHADOWING — an inner declaration with the same name hides the outer one
 *   for the rest of that block. The outer variable is untouched.
 *
 *   TDZ (Temporal Dead Zone) — let/const exist from the top of their block
 *   but cannot be TOUCHED until the declaration line runs. Touching one
 *   early throws ReferenceError. `var` instead gives you undefined.
 * ==========================================================================*/

section('Exercise 1 — reading outward');
/* `factor` lives outside. Use it inside without passing it in.
 * scaleAll([1,2]) -> [10, 20]                                    */
const factor = 10;
function scaleAll(nums) {
  // your code here
}
check('scaleAll', scaleAll([1, 2]), [10, 20]);

section('Exercise 2 — you cannot read inward');
/* insideOnly declares a local variable. tryToRead must report what
 * happens when the outside tries to use it.
 * Return the string 'ReferenceError' when reading `hidden` throws.  */
function insideOnly() {
  const hidden = 'secret';
  return hidden;
}
function tryToRead() {
  // your code here: try to read `hidden`, catch, return e.constructor.name
}
check('cannot see inside', tryToRead(), 'ReferenceError');

section('Exercise 3 — block scope');
/* Declare a variable inside the if-block with `let`, and return whether
 * it is visible afterwards. Return 'gone' if reading it throws,
 * or its value if it survives.                                   */
function blockTest() {
  let seenInside;
  if (true) {
    // your code here: declare `inner` with let and the value 'here',
    // then set seenInside = inner
  }
  try {
    return [seenInside, inner];        // eslint-disable-line no-undef
  } catch {
    return [seenInside, 'gone'];
  }
}
check('visible inside, gone outside', blockTest(), ['here', 'gone']);

section('Exercise 4 — var leaks');
/* Same shape, but with `var`. Return the value that survives.
 * (Declare `leaky` with var inside the if-block, set it to 'here'.)  */
function varTest() {
  if (true) {
    // your code here
  }
  try {
    return leaky;            // eslint-disable-line no-undef
  } catch {
    return 'gone';
  }
}
check('var leaks out of the block', varTest(), 'here');

section('Exercise 5 — shadowing');
/* `name` exists outside. Inside shadowTest, declare ANOTHER `name` with
 * the value 'inner' and return both: the inner one, then the outer one
 * read from a helper that is outside the shadow.
 * shadowTest() -> ['inner', 'outer']                             */
const name = 'outer';
function readOuterName() {
  return name;
}
function shadowTest() {
  // your code here
}
check('shadowing', shadowTest(), ['inner', 'outer']);

section('Exercise 6 — the scope chain');
/* Three levels. innermost must build 'a-b-c' from all three variables
 * without any of them being passed as arguments.                 */
function chain() {
  const a = 'a';
  function middle() {
    const b = 'b';
    function innermost() {
      const c = 'c';
      // your code here
    }
    return innermost();
  }
  return middle();
}
check('scope chain', chain(), 'a-b-c');

section('Exercise 7 — const contents are mutable');
/* Show both halves of the rule.
 * canMutate() must change the CONTENTS of a const array and return it.
 * cannotReassign() must try to REASSIGN a const and return the error name. */
function canMutate() {
  const list = [1];
  // your code here: add 2 to it, then return it
}
function cannotReassign() {
  // your code here: declare a const, try to reassign it in a try/catch,
  // return e.constructor.name
}
check('contents can change', canMutate(), [1, 2]);
check('the binding cannot', cannotReassign(), 'TypeError');

section('Exercise 8 — each call gets fresh locals');
/* counterLocal() creates a local count, adds one, returns it.
 * Calling it three times must still return 1 each time — local variables
 * do NOT persist between calls. (File 05 is about the trick that makes
 * them persist.)                                                 */
function counterLocal() {
  // your code here
}
check('always 1', () => [counterLocal(), counterLocal(), counterLocal()], [1, 1, 1], counterLocal);

section('Exercise 9 — a private helper');
/* outer() defines a helper inside itself and uses it. The helper must NOT
 * be reachable from outside.
 * outer([1,2,3]) -> 12    (each item doubled, then summed)
 * isHelperVisible() -> 'ReferenceError'                          */
function outer(nums) {
  // your code here: declare `double` inside, use it
}
check('outer works', outer([1, 2, 3]), 12);
// Try calling double(2) from out here afterwards — it is a ReferenceError.
// A function declared inside another function is invisible from outside it.

section('Exercise 10 — blocks inside loops');
/* Collect a value declared INSIDE the loop body with let.
 * Each iteration gets its own binding.
 * collectSquares(3) -> [0, 1, 4]                                 */
function collectSquares(n) {
  // your code here
}
check('collectSquares', collectSquares(3), [0, 1, 4]);

section('PREDICTIONS');

// P1: var hoisting — declared but not yet assigned
function varHoist() {
  const before = String(x);
  var x = 1;                                     // eslint-disable-line no-var
  return before;
}
let p1 = null;
check('P1  reading a var above its assignment', p1, varHoist());

// P2: let in the temporal dead zone
function letTdz() {
  try { return String(y); } catch (e) { return e.constructor.name; }
  let y = 1;                                     // eslint-disable-line no-unused-vars
}
let p2 = null;
check('P2  reading a let above its declaration', p2, letTdz());

// P3: typeof on an undeclared name is safe; on a TDZ let it is not
let p3 = null;
check('P3  typeof neverDeclared', p3, typeof neverDeclared); // eslint-disable-line no-undef

// P4: shadowing does not change the outer variable
let outerVal = 'outer';
{
  let outerVal = 'inner';                        // eslint-disable-line no-unused-vars
}
let p4 = null;
check('P4  outerVal after the block', p4, outerVal);

// P5: a function declared inside a block
function blockFn() {
  {
    function inner() { return 'in block'; }      // eslint-disable-line no-inner-declarations
  }
  try { return inner(); } catch (e) { return e.constructor.name; } // eslint-disable-line no-undef
}
let p5 = null;
check('P5  calling a block-scoped function declaration in strict mode', p5, blockFn());

// P6: assigning without declaring, in strict mode
function noDeclaration() {
  try { undeclaredThing = 5; return 'allowed'; } catch (e) { return e.constructor.name; } // eslint-disable-line
}
let p6 = null;
check('P6  undeclaredThing = 5 in strict mode', p6, noDeclaration());

log('rule', 'default to const, use let when you must reassign, never use var');

report();

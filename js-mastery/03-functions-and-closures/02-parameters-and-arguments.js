'use strict';
const { check, section, log, report } = require('../_helpers/check');

/* ============================================================================
 * FUNCTIONS 02 — PARAMETERS & ARGUMENTS
 *
 * NOTES:
 *   PARAMETER = the name in the definition.  ARGUMENT = the value you pass.
 *
 *   JavaScript never complains about the count. Too few arguments and the
 *   extra parameters are undefined; too many and the extras are ignored.
 *
 *   DEFAULTS   function f(a = 1)        used ONLY when the argument is
 *                                       undefined — null does NOT trigger it
 *              function f(a, b = a * 2) later defaults can use earlier ones
 *
 *   REST       function f(first, ...others)   collects the remainder, always
 *                                             a real array, always last
 *
 *   `arguments` is an old array-LIKE object holding every argument. It does
 *   not exist in arrow functions. Prefer rest parameters — but you will
 *   meet `arguments` in older code.
 *
 *   OBJECT PARAMETERS are how real APIs stay readable:
 *     createUser({ name, role = 'user' })   named, order-free, self-documenting
 *
 *   Arguments are passed BY VALUE. For an object, the value is a reference,
 *   so the function can change what the object CONTAINS but cannot change
 *   which object the caller's variable points at. See P4/P5.
 * ==========================================================================*/

section('Exercise 1 — missing arguments');
/* Return a string showing what actually arrived.
 * show(1, 2) -> '1,2'  ;  show(1) -> '1,undefined'
 * Use String(b) so undefined becomes text.                       */
function show(a, b) {
  // your code here
}
check('both', show(1, 2), '1,2');
check('one missing', show(1), '1,undefined');

section('Exercise 2 — defaults');
/* connect() -> 'localhost:80'
 * connect('db') -> 'db:80'
 * connect('db', 5432) -> 'db:5432'                               */
function connect(host = 'localhost', port = 80) {
  // your code here
}
check('no args', connect(), 'localhost:80');
check('one arg', connect('db'), 'db:80');
check('both', connect('db', 5432), 'db:5432');

section('Exercise 3 — a default that uses an earlier parameter');
/* range(3) -> [0, 1, 2]        end defaults to start, start defaults to 0
 * rangeFrom(2, 5) -> [2, 3, 4]
 * Write rangeFrom(start, end = start + 3) and return the numbers from
 * start up to but not including end.                             */
function rangeFrom(start, end = start + 3) {
  // your code here
}
check('explicit end', rangeFrom(2, 5), [2, 3, 4]);
check('default end', rangeFrom(2), [2, 3, 4]);

section('Exercise 4 — a default that is computed');
/* The default value is re-evaluated on EVERY call that needs it.
 * Return a new empty array each time when no list is given, and push
 * `item` into it.
 * addItem('a') -> ['a']   and calling it again must ALSO give ['a']   */
function addItem(item, list = []) {
  // your code here
}
check('first call', addItem('a'), ['a']);
check('second call is not polluted', addItem('b'), ['b']);
check('given a list', addItem('c', ['x']), ['x', 'c']);

section('Exercise 5 — rest parameters');
/* sum(1, 2, 3) -> 6 ; sum() -> 0
 * joinWith('-', 'a', 'b') -> 'a-b'   (first parameter is the separator) */
function sum(...nums) {
  // your code here
}
function joinWith(separator, ...parts) {
  // your code here
}
check('sum', sum(1, 2, 3), 6);
check('sum none', sum(), 0);
check('joinWith', joinWith('-', 'a', 'b'), 'a-b');
check('joinWith nothing to join', joinWith('-'), '');

section('Exercise 6 — the arguments object');
/* Same as sum, but written the OLD way: no rest parameter in the
 * definition, read `arguments` instead and convert it to an array.
 * oldSum(1, 2, 3) -> 6
 * (It must be a `function`, not an arrow — arrows have no `arguments`.) */
function oldSum() {
  // your code here
}
check('oldSum', oldSum(1, 2, 3), 6);
check('oldSum none', oldSum(), 0);

section('Exercise 7 — object parameters');
/* createUser({ name: 'Asha' })
 *   -> { name: 'Asha', role: 'user', active: true }
 * createUser({ name: 'Ben', role: 'admin', active: false })
 *   -> { name: 'Ben', role: 'admin', active: false }
 * Destructure in the parameter list with defaults.               */
function createUser({ name, role = 'user', active = true } = {}) {
  // your code here
}
check('defaults', createUser({ name: 'Asha' }), { name: 'Asha', role: 'user', active: true });
check('overrides', createUser({ name: 'Ben', role: 'admin', active: false }),
  { name: 'Ben', role: 'admin', active: false });
check('false is respected', () => createUser({ name: 'x', active: false }).active, false);

section('Exercise 8 — forwarding arguments');
/* callWith(fn, args) calls fn with the ARRAY of arguments spread out.
 * callWith(Math.max, [1, 9, 3]) -> 9                             */
function callWith(fn, args) {
  // your code here
}
check('spread call', callWith(Math.max, [1, 9, 3]), 9);
check('own function', callWith((a, b) => a - b, [10, 4]), 6);

section('Exercise 9 — required arguments');
/* Throw a clear error when `id` is not given. A default whose value is a
 * function CALL is a neat trick for this:
 *   function get(id = required('id')) { ... }
 * where required(name) throws `${name} is required`.
 * Write both.                                                    */
function required(name) {
  // your code here
}
function get(id = required('id')) {
  return `got ${id}`;
}
check('with an id', () => get('x1'), 'got x1', required);
check('without one throws', () => {
  try { get(); return 'no throw'; } catch (e) { return e.message; }
}, 'id is required', required);

section('Exercise 10 — argument mutation');
/* addTag mutates the array it is given (the caller sees the change).
 * addTagSafely returns a NEW array and leaves the caller's array alone. */
function addTag(tags, tag) {
  // your code here
}
function addTagSafely(tags, tag) {
  // your code here
}
const mine = ['a'];
check('mutating version returns', addTag(mine, 'b'), ['a', 'b']);
check('caller sees the change', mine, ['a', 'b']);
const yours = ['a'];
check('safe version returns', addTagSafely(yours, 'b'), ['a', 'b']);
check('caller is untouched', yours, ['a']);

section('PREDICTIONS');

// P1: too many arguments
function takesOne(a) { return a; }
let p1 = null;
check('P1  takesOne(1, 2, 3)', p1, takesOne(1, 2, 3));

// P2: does null trigger a default?
function d(a = 'fallback') { return a; }
let p2 = '???';
check('P2  d(null)', p2, d(null));

// P3: and undefined?
let p3 = null;
check('P3  d(undefined)', p3, d(undefined));

// P4: reassigning a parameter inside the function
function reassign(obj) { obj = { replaced: true }; return 'done'; }
const original4 = { a: 1 };
reassign(original4);
let p4 = null;
check('P4  original4 after reassign(original4)', p4, original4);

// P5: mutating a parameter instead of reassigning it
function mutate(obj) { obj.a = 99; }
const original5 = { a: 1 };
mutate(original5);
let p5 = null;
check('P5  original5 after mutate(original5)', p5, original5);

// P6: is `arguments` a real array?
function argTest() { return Array.isArray(arguments); }
let p6 = null;
check('P6  Array.isArray(arguments)', p6, argTest(1, 2));

log('lesson', 'P4 vs P5 is the whole "pass by value of a reference" story');

report();

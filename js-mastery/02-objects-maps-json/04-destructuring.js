'use strict';
const { check, section, log, report } = require('../_helpers/check');

/* ============================================================================
 * OBJECTS 04 — DESTRUCTURING
 *
 * NOTES:
 *   const { name } = user                 pull out by KEY (order irrelevant)
 *   const { name: n } = user              rename it to `n`
 *   const { age = 18 } = user             default when the value is undefined
 *   const { a: { b } } = obj              nested
 *   const { id, ...rest } = obj           rest collects the other keys
 *
 *   In a parameter list it becomes a self-documenting signature:
 *     function greet({ name, greeting = 'Hi' }) { ... }
 *     greet({ name: 'Asha' })
 *
 *   Add a default for the whole parameter so calling with no argument works:
 *     function greet({ name } = {}) { ... }
 * ==========================================================================*/

const USER = {
  id: 'u1',
  name: 'Asha',
  address: { city: 'Pune', zip: '411001' },
  roles: ['admin', 'editor'],
};

section('Exercise 1 — basic destructuring');
/* Pull `name` and `id` out with ONE destructuring statement, return
 * `${name} (${id})`.
 * nameTag(USER) -> 'Asha (u1)'                                   */
function nameTag(user) {
  // your code here
}
check('nameTag', nameTag(USER), 'Asha (u1)');

section('Exercise 2 — renaming');
/* Destructure `name` into a variable called `label` and return it.
 * (Write it as { name: label } so you actually practise the syntax.)
 * labelOf({ name: 'x' }) -> 'x'                                  */
function labelOf(obj) {
  // your code here
}
check('labelOf', labelOf({ name: 'x' }), 'x');

section('Exercise 3 — defaults');
/* Destructure with defaults: theme = 'light', fontSize = 14.
 * settings({}) -> { theme: 'light', fontSize: 14 }
 * settings({ theme: 'dark' }) -> { theme: 'dark', fontSize: 14 } */
function settings(input) {
  // your code here
}
check('all defaults', settings({}), { theme: 'light', fontSize: 14 });
check('one override', settings({ theme: 'dark' }), { theme: 'dark', fontSize: 14 });

section('Exercise 4 — nested destructuring');
/* Get the city out of user.address in one destructuring statement.
 * cityOf(USER) -> 'Pune'                                         */
function cityOf(user) {
  // your code here
}
check('cityOf', cityOf(USER), 'Pune');

section('Exercise 5 — nested with a default');
/* Some users have no address at all. Default the whole nested object.
 * Hint: const { address: { city = 'unknown' } = {} } = user;
 * safeCity({}) -> 'unknown'                                      */
function safeCity(user) {
  // your code here
}
check('has city', safeCity(USER), 'Pune');
check('no address', safeCity({}), 'unknown');
check('address without city', safeCity({ address: {} }), 'unknown');

section('Exercise 6 — rest in a pattern');
/* Split off `id`, keep everything else.
 * splitId({ id: 1, a: 2, b: 3 }) -> { id: 1, rest: { a: 2, b: 3 } } */
function splitId(obj) {
  // your code here
}
check('splitId', splitId({ id: 1, a: 2, b: 3 }), { id: 1, rest: { a: 2, b: 3 } });

section('Exercise 7 — destructured parameters');
/* Destructure in the PARAMETER LIST, with greeting defaulting to 'Hi'.
 * greet({ name: 'Asha' }) -> 'Hi, Asha!'
 * greet({ name: 'Ben', greeting: 'Yo' }) -> 'Yo, Ben!'           */
function greet(/* destructure here */) {
  // your code here
}
check('default greeting', greet({ name: 'Asha' }), 'Hi, Asha!');
check('custom greeting', greet({ name: 'Ben', greeting: 'Yo' }), 'Yo, Ben!');

section('Exercise 8 — parameter object with a whole-object default');
/* connect() must work with NO argument at all.
 * connect() -> 'localhost:8080'
 * connect({ port: 3000 }) -> 'localhost:3000'
 * Hint: function connect({ host = 'localhost', port = 8080 } = {}) */
function connect(/* destructure here */) {
  // your code here
}
check('no argument', connect(), 'localhost:8080');
check('partial', connect({ port: 3000 }), 'localhost:3000');
check('both', connect({ host: 'db', port: 5432 }), 'db:5432');

section('Exercise 9 — destructuring arrays inside objects');
/* firstRole(USER) -> 'admin'
 * Destructure the array in the same statement:
 *   const { roles: [first] } = user;                             */
function firstRole(user) {
  // your code here
}
check('firstRole', firstRole(USER), 'admin');

section('Exercise 10 — destructuring in a callback');
/* Each item is { name, score }. Return names of everyone scoring >= 50,
 * destructuring in the callback parameter list.
 * passingNames([{name:'a',score:70},{name:'b',score:20}]) -> ['a'] */
function passingNames(people) {
  // your code here
}
check('passingNames', passingNames([{ name: 'a', score: 70 }, { name: 'b', score: 20 }]), ['a']);

section('Exercise 11 — swap two properties');
/* Return a new object with the values of `a` and `b` swapped.
 * swapProps({ a: 1, b: 2, c: 3 }) -> { a: 2, b: 1, c: 3 }        */
function swapProps(obj) {
  // your code here
}
check('swapProps', swapProps({ a: 1, b: 2, c: 3 }), { a: 2, b: 1, c: 3 });

section('PREDICTIONS');

// P1: destructuring a key that is not there
const { missing } = { a: 1 };
let p1 = null;
check('P1  String(missing)', p1, String(missing));

// P2: does a default fire for null?
const { x = 'fallback' } = { x: null };
let p2 = '???';   // placeholder is a string here — write the real value
check('P2  const { x = "fallback" } = { x: null }', p2, x);

// P3: destructuring null itself
let outcome3;
try { const { y } = null; outcome3 = y; } catch (e) { outcome3 = e.constructor.name; }
let p3 = null;
check('P3  const { y } = null', p3, outcome3);

// P4: destructuring a string — it has a length property
const { length } = 'hello';
let p4 = null;
check('P4  const { length } = "hello"', p4, length);

// P5: rest gathers a COPY of the remaining keys, but shallowly
const src5 = { a: { deep: 1 }, b: 2 };
const { b, ...rest5 } = src5;
rest5.a.deep = 99;
let p5 = null;
check('P5  src5.a.deep after mutating rest5.a', p5, src5.a.deep);

log('lesson', 'destructuring is a COPY of the references, never a deep copy');

report();

'use strict';
const { check, section, log, report } = require('../_helpers/check');

/* ============================================================================
 * FUNCTIONS 05 — CLOSURES
 *
 * THE definition, in one sentence:
 *   A closure is a function that remembers the variables of the scope it was
 *   CREATED in, and keeps them alive for as long as the function exists.
 *
 * In file 04 you proved local variables vanish when a function returns.
 * That is only true when nothing still refers to them. Return a function
 * that uses them, and they survive — privately, reachable only through
 * that function.
 *
 *   function makeCounter() {
 *     let count = 0;                 // created once, per makeCounter() call
 *     return () => ++count;          // this arrow closes over `count`
 *   }
 *   const a = makeCounter();  a(); a();   // 1, 2
 *   const b = makeCounter();  b();        // 1  <- its own separate `count`
 *
 * Three things to hold onto:
 *   1. Each CALL to the outer function creates a fresh set of variables.
 *   2. Every inner function from that same call SHARES those variables.
 *   3. The closure captures the VARIABLE, not a copy of its value — if the
 *      variable changes later, the closure sees the new value.
 *
 * This is how you get private state, function factories, memoisation,
 * event handlers that remember things, and module-style encapsulation.
 * ==========================================================================*/

section('Exercise 1 — the counter');
/* makeCounter() returns a function. Each call to that function returns the
 * next number, starting at 1. Two counters must be independent.  */
function makeCounter() {
  // your code here
}
check('counts up', () => { const c = makeCounter(); return [c(), c(), c()]; }, [1, 2, 3]);
check('independent', () => {
  const a = makeCounter(); const b = makeCounter();
  a(); a();
  return [a(), b()];
}, [3, 1]);

section('Exercise 2 — private state with an interface');
/* makeAccount(100) returns { deposit, withdraw, balance }.
 *   deposit(50)  -> the new balance
 *   withdraw(30) -> the new balance, or the string 'insufficient funds'
 *                   when there is not enough (and nothing is taken)
 *   balance()    -> the current balance
 * The balance must NOT be readable as a property:
 *   Object.keys(account) contains only the three function names.  */
function makeAccount(starting) {
  // your code here
}
check('starting balance', () => makeAccount(100).balance(), 100);
check('deposit', () => { const a = makeAccount(100); return a.deposit(50); }, 150);
check('withdraw', () => { const a = makeAccount(100); a.deposit(50); return a.withdraw(30); }, 120);
check('overdraft refused', () => makeAccount(10).withdraw(50), 'insufficient funds');
check('refused withdrawal changes nothing', () => {
  const a = makeAccount(10);
  a.withdraw(50);
  return a.balance();
}, 10);
check('balance is private', () => Object.keys(makeAccount(1)).sort(),
  ['balance', 'deposit', 'withdraw']);
check('accounts are separate', () => {
  const a = makeAccount(100); const b = makeAccount(100);
  a.deposit(1000);
  return b.balance();
}, 100);

section('Exercise 3 — shared state between two closures');
/* makeToggle(false) returns { toggle, value }.
 * Both functions must see the SAME variable:
 *   t.toggle(); t.value() -> true                                */
function makeToggle(initial) {
  // your code here
}
check('starts', () => makeToggle(false).value(), false);
check('toggles', () => { const t = makeToggle(false); t.toggle(); return t.value(); }, true);
check('toggles back', () => {
  const t = makeToggle(false);
  t.toggle(); t.toggle();
  return t.value();
}, false);
check('toggle returns the new value', () => makeToggle(false).toggle(), true);

section('Exercise 4 — a function factory');
/* Build specialised functions from a general one.
 * makeGreeter('Hello') -> a function; calling it with 'Asha' gives
 * 'Hello, Asha!'                                                 */
function makeGreeter(greeting) {
  // your code here
}
check('hello', () => makeGreeter('Hello')('Asha'), 'Hello, Asha!');
check('different greeting', () => makeGreeter('Yo')('Ben'), 'Yo, Ben!');
check('each greeter keeps its own word', () => {
  const hi = makeGreeter('Hi'); const bye = makeGreeter('Bye');
  return [hi('a'), bye('b')];
}, ['Hi, a!', 'Bye, b!']);

section('Exercise 5 — once');
/* once(fn) returns a function that runs fn the FIRST time only. Every
 * later call returns the first result without running fn again.
 * Used for "initialise exactly once" logic everywhere in real code.  */
function once(fn) {
  // your code here
}
check('runs once', () => {
  let calls = 0;
  const init = once(() => { calls++; return 'ready'; });
  return [init(), init(), init(), calls];
}, ['ready', 'ready', 'ready', 1]);
check('passes the arguments through', () => {
  const add = once((a, b) => a + b);
  return [add(2, 3), add(100, 100)];
}, [5, 5]);

section('Exercise 6 — a private list');
/* makeLog() returns { add, all, count }.
 *   add(msg)  appends and returns the count
 *   all()     returns a COPY of the messages, so the caller cannot
 *             mutate the private array through it
 *   count()   the number of messages                             */
function makeLog() {
  // your code here
}
check('adds', () => { const l = makeLog(); l.add('a'); l.add('b'); return l.all(); }, ['a', 'b']);
check('count', () => { const l = makeLog(); l.add('a'); return l.count(); }, 1);
check('all() returns a copy', () => {
  const l = makeLog();
  l.add('a');
  l.all().push('hacked');
  return l.all();
}, ['a']);

section('Exercise 7 — closure over a parameter');
/* The parameter itself is captured — no extra variable needed.
 * multiplyBy(3)(4) -> 12                                         */
const multiplyBy = (factor) => null; // replace null with the inner function
check('by 3', () => multiplyBy(3)(4), 12);
check('by 10', () => multiplyBy(10)(4), 40);

section('Exercise 8 — the variable, not a copy');
/* Prove that a closure sees LATER changes to the captured variable.
 * makeReader() returns { set, read } where read() always reports the
 * latest value set. Start as null.                               */
function makeReader() {
  // your code here
}
check('sees later writes', () => {
  const r = makeReader();
  r.set('first');
  const before = r.read();
  r.set('second');
  return [before, r.read()];
}, ['first', 'second']);

section('Exercise 9 — memoize');
/* Cache results by argument so an expensive function runs once per input.
 * Single argument only; use a Map keyed by that argument.        */
function memoize(fn) {
  // your code here
}
check('caches', () => {
  let calls = 0;
  const slow = memoize((n) => { calls++; return n * 2; });
  return [slow(5), slow(5), slow(5), calls];
}, [10, 10, 10, 1]);
check('different inputs each compute once', () => {
  let calls = 0;
  const slow = memoize((n) => { calls++; return n * 2; });
  slow(1); slow(2); slow(1); slow(2);
  return calls;
}, 2);
check('each memoized function has its own cache', () => {
  let calls = 0;
  const make = () => memoize((n) => { calls++; return n; });
  const a = make(); const b = make();
  a(1); b(1);
  return calls;
}, 2);

section('Exercise 10 — the module pattern');
/* An IIFE that returns an interface, with everything else private.
 * Build `idGenerator` so that:
 *   idGenerator.next() -> 'id-1', then 'id-2', ...
 *   idGenerator.reset() sets it back so the next call is 'id-1'
 * The counter must not be reachable from outside.
 * Shape:  const idGenerator = (function () { ... return { ... }; })();  */
const idGenerator = null; // replace with the IIFE
check('increments', () => { idGenerator.reset(); return [idGenerator.next(), idGenerator.next()]; },
  ['id-1', 'id-2']);
check('reset', () => {
  idGenerator.reset(); idGenerator.next(); idGenerator.reset();
  return idGenerator.next();
}, 'id-1');
check('counter is private', () => Object.keys(idGenerator).sort(), ['next', 'reset']);

section('Exercise 11 — closures capture, they do not copy');
/* makeAdders() returns an array of three functions built from the SAME
 * variable `base`, which changes to 100 before returning.
 * Because all three captured the variable (not its value), every one of
 * them must now add 100.
 * makeAdders()[0](1) -> 101
 * Write it so this is true: declare `let base = 0`, build the three
 * functions, then set base = 100 before returning them.          */
function makeAdders() {
  // your code here
}
check('all see the final value', () => makeAdders().map((fn) => fn(1)), [101, 101, 101]);

section('PREDICTIONS');

// P1: do two calls to the factory share state?
function counterFactory() { let n = 0; return () => ++n; }
const c1 = counterFactory();
const c2 = counterFactory();
c1(); c1();
let p1 = null;
check('P1  c2() after calling c1() twice', p1, c2());

// P2: two closures from the SAME call
function pairFactory() {
  let n = 0;
  return [() => ++n, () => n];
}
const [inc, read] = pairFactory();
inc(); inc();
let p2 = null;
check('P2  read() after inc() twice', p2, read());

// P3: is the captured variable a snapshot?
let shared = 'before';
const readShared = () => shared;
shared = 'after';
let p3 = null;
check('P3  readShared()', p3, readShared());

// P4: closure over a parameter of a finished call
function outerP4(x) { return () => x; }
const keep = outerP4('kept');
let p4 = null;
check('P4  keep() long after outerP4 returned', p4, keep());

// P5: does the closure keep the whole object alive, or just the value?
function makeBig() {
  const big = { data: 'lots' };
  return () => big.data;
}
let p5 = null;
check('P5  makeBig()()', p5, makeBig()());

log('the test for a closure', 'does this function use a variable it did not declare or receive?');

report();

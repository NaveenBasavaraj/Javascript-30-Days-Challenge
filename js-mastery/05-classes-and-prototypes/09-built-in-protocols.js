'use strict';
const { check, section, log, report } = require('../_helpers/check');

/* ============================================================================
 * CLASSES 09 — BUILT-IN PROTOCOLS
 *
 * Your classes can plug into the language's own syntax by implementing the
 * methods it looks for. This is how a class becomes a first-class citizen
 * rather than a bag of data.
 *
 *   toString()               used by String(obj), `${obj}` and obj + ''
 *   valueOf()                used when a NUMBER is wanted: obj * 2, obj > x
 *   [Symbol.toPrimitive](hint)   takes over both, with hint of
 *                            'string' | 'number' | 'default'
 *   toJSON()                 used by JSON.stringify — return what to serialise
 *   [Symbol.iterator]()      makes the object work with for...of, spread
 *                            and destructuring
 *   [Symbol.toStringTag]     what Object.prototype.toString.call() reports
 *
 * An ITERATOR is any object with a next() returning { value, done }.
 * A GENERATOR function (function*) builds one for you — `yield` hands out
 * the next value and pauses.
 * ==========================================================================*/

section('Exercise 1 — toString');
/* Point(1,2) with toString() -> '(1, 2)'.
 * Then it works inside template literals and string concatenation for
 * free.                                                          */
class Point {
  // your code here
}
check('direct', () => new Point(1, 2).toString(), '(1, 2)', Point);
check('in a template', () => `${new Point(1, 2)}`, '(1, 2)', Point);
check('with String()', () => String(new Point(3, 4)), '(3, 4)', Point);
check('with concatenation', () => '' + new Point(0, 0), '(0, 0)', Point);

section('Exercise 2 — valueOf');
/* Money(paise) with valueOf() returning the paise, so arithmetic and
 * comparison just work.                                          */
class Money {
  // your code here
}
check('adds', () => new Money(500) + new Money(250), 750, Money);
check('compares', () => new Money(500) > new Money(250), true, Money);
check('multiplies', () => new Money(100) * 3, 300, Money);
check('sorts', () => [new Money(3), new Money(1), new Money(2)]
  .sort((a, b) => a - b).map((m) => m.valueOf()), [1, 2, 3], Money);

section('Exercise 3 — Symbol.toPrimitive');
/* Temp(celsius) answers differently depending on what is wanted:
 *   hint 'number'  -> the celsius number
 *   hint 'string'  -> '25°C'
 *   hint 'default' -> the number
 * Implement [Symbol.toPrimitive](hint).                          */
class Temp {
  // your code here
}
check('number hint', () => +new Temp(25), 25, Temp);
check('string hint', () => `${new Temp(25)}`, '25°C', Temp);
check('default hint', () => new Temp(25) + 5, 30, Temp);
check('String() uses the string hint', () => String(new Temp(0)), '0°C', Temp);

section('Exercise 4 — toJSON');
/* User(name, password) must never serialise the password.
 * JSON.stringify(new User('a','secret')) -> '{"name":"a"}'
 * The password stays readable as a property on the instance.     */
class User {
  // your code here
}
check('hides the password', () => JSON.stringify(new User('a', 'secret')), '{"name":"a"}', User);
check('but the field still exists', () => new User('a', 'secret').password, 'secret');
check('inside a bigger structure', () => JSON.stringify({ u: new User('a', 's') }), '{"u":{"name":"a"}}', User);

section('Exercise 5 — Symbol.iterator with a generator');
/* Range(1, 4) is iterable and yields 1, 2, 3, 4.
 * Implement *[Symbol.iterator]() with a loop and `yield`.        */
class Range {
  // your code here
}
check('for...of', () => {
  const out = [];
  for (const n of new Range(1, 4)) out.push(n);
  return out;
}, [1, 2, 3, 4]);
check('spread', () => [...new Range(1, 3)], [1, 2, 3]);
check('destructuring', () => { const [a, b] = new Range(5, 9); return [a, b]; }, [5, 6]);
check('Array.from', () => Array.from(new Range(2, 4)), [2, 3, 4], Range);
check('a single value', () => [...new Range(7, 7)], [7]);

section('Exercise 6 — a hand-written iterator');
/* Same thing WITHOUT a generator: return an object with a next()
 * giving { value, done }. This is what function* was doing for you.  */
class Countdown {
  // your code here
}
check('counts down', () => [...new Countdown(3)], [3, 2, 1]);
check('zero yields nothing', () => [...new Countdown(0)], []);
check('iterating twice works', () => {
  const c = new Countdown(2);
  return [[...c], [...c]];
}, [[2, 1], [2, 1]]);

section('Exercise 7 — an iterable collection');
/* Playlist holds songs, is iterable, and has a `length` getter.
 *   add(song) is chainable
 *   [...playlist] gives the songs                                */
class Playlist {
  // your code here
}
check('iterates', () => [...new Playlist().add('a').add('b')], ['a', 'b']);
check('length', () => new Playlist().add('a').length, 1);
check('for...of', () => {
  const out = [];
  for (const s of new Playlist().add('x')) out.push(s);
  return out;
}, ['x']);
check('empty', () => [...new Playlist()], []);

section('Exercise 8 — Symbol.toStringTag');
/* Make Object.prototype.toString.call(new Tagged()) report
 * '[object Tagged]' by defining a get [Symbol.toStringTag].      */
class Tagged {
  // your code here
}
check('tagged', () => Object.prototype.toString.call(new Tagged()), '[object Tagged]', Tagged);
check('a plain class is not', () => Object.prototype.toString.call(new Point(1, 1)), '[object Object]', Tagged);

section('Exercise 9 — a generator method');
/* Tree is { value, children: [] }. Write a generator method *walk()
 * yielding every value, parents before children.                 */
const TREE = {
  value: 'root',
  children: [
    { value: 'a', children: [{ value: 'a1', children: [] }] },
    { value: 'b', children: [] },
  ],
};
class TreeWalker {
  constructor(root) { this.root = root; }

  * walk(node = this.root) {
    // your code here
  }
}
check('depth first', () => [...new TreeWalker(TREE).walk()], ['root', 'a', 'a1', 'b'], TreeWalker.prototype.walk);
check('a leaf', () => [...new TreeWalker({ value: 'x', children: [] }).walk()], ['x'], TreeWalker.prototype.walk);

section('Exercise 10 — making a class work everywhere');
/* Version(1, 2, 3) with:
 *   toString()  -> '1.2.3'
 *   valueOf()   -> a sortable number: major * 10000 + minor * 100 + patch
 *   toJSON()    -> the string form
 *   static parse('1.2.3') -> a Version                           */
class Version {
  // your code here
}
check('toString', () => `${new Version(1, 2, 3)}`, '1.2.3', Version);
check('comparable', () => new Version(1, 10, 0) > new Version(1, 9, 9), true, Version);
check('json', () => JSON.stringify({ v: new Version(1, 2, 3) }), '{"v":"1.2.3"}', Version);
check('parse', () => new Version(1, 2, 3).valueOf() === Version.parse('1.2.3').valueOf(), true, Version);
check('sorting a list', () => [new Version(1, 2, 0), new Version(1, 0, 5), new Version(1, 10, 0)]
  .sort((a, b) => a - b).map(String), ['1.0.5', '1.2.0', '1.10.0'], Version);

section('PREDICTIONS');

// P1: the default toString of a class instance
class P1c {}
let p1 = null;
check('P1  String(new P1c())', p1, String(new P1c()));

// P2: an object in a template literal
let p2 = null;
check('P2  `${{}}`', p2, `${{}}`);

// P3: which wins, toString or valueOf, for + ?
class P3c { toString() { return 'str'; } valueOf() { return 10; } }
let p3 = null;
check('P3  new P3c() + 1', p3, new P3c() + 1);

// P4: and inside a template literal?
let p4 = null;
check('P4  `${new P3c()}`', p4, `${new P3c()}`);

// P5: is a plain object iterable?
let outcome5;
try { outcome5 = [...{ a: 1 }]; } catch (e) { outcome5 = e.constructor.name; }
let p5 = null;
check('P5  [...{ a: 1 }]', p5, outcome5);

// P6: what does a generator function return when called?
function* gen() { yield 1; }
let p6 = null;
check('P6  typeof gen()', p6, typeof gen());

// P7: a generator's next()
const g7 = gen();
let p7 = null;
check('P7  gen().next()', p7, g7.next());

// P8: and after it is exhausted
g7.next();
let p8 = null;
check('P8  the next() after that', p8, g7.next());

log('the payoff', 'implement the protocol and your class works with syntax you never wrote');

report();

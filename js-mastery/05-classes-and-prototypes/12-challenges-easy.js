'use strict';
const { check, section, log, report } = require('../_helpers/check');

/* ============================================================================
 * CLASSES 12 — CHALLENGES, LEVEL 1
 *
 * Files 01-11 combined. Each one is a small, complete class.
 * ==========================================================================*/

section('1 — Stack');
/* push(x) -> the new size ; pop() -> the item or null ; peek() ; get size
 * get isEmpty. The storage must be private.                      */
class Stack {
  // your code here
}
check('lifo', () => { const s = new Stack(); s.push('a'); s.push('b'); return [s.pop(), s.pop(), s.pop()]; },
  ['b', 'a', null]);
check('size and peek', () => { const s = new Stack(); s.push(1); return [s.size, s.peek(), s.size]; }, [1, 1, 1]);
check('isEmpty', () => { const s = new Stack(); const a = s.isEmpty; s.push(1); return [a, s.isEmpty]; }, [true, false]);
check('storage is private', () => Object.keys(new Stack()), [], Stack);

section('2 — Queue');
/* enqueue(x) -> the new size ; dequeue() -> the oldest or null ; get size  */
class Queue {
  // your code here
}
check('fifo', () => {
  const q = new Queue();
  q.enqueue('a'); q.enqueue('b');
  return [q.dequeue(), q.dequeue(), q.dequeue()];
}, ['a', 'b', null]);
check('size', () => { const q = new Queue(); q.enqueue(1); q.enqueue(2); return q.size; }, 2);

section('3 — Temperature with validation');
/* celsius is settable but must be at least -273.15, or it throws
 * 'below absolute zero'. fahrenheit and kelvin are computed getters.
 * kelvin = celsius + 273.15                                      */
class Temperature {
  // your code here
}
check('converts', () => { const t = new Temperature(100); return [t.fahrenheit, t.kelvin]; }, [212, 373.15]);
check('settable', () => { const t = new Temperature(0); t.celsius = 100; return t.fahrenheit; }, 212);
check('rejects impossible', () => {
  try { return new Temperature(-300).celsius; } catch (e) { return e.message; }
}, 'below absolute zero');
check('absolute zero is allowed', () => new Temperature(-273.15).kelvin, 0);

section('4 — Rectangle and Square');
/* Rectangle(w, h) with get area, get perimeter and toString() -> 'WxH'.
 * Square(side) extends it and passes the side twice.             */
class Rectangle {
  // your code here
}
class Square extends Rectangle {
  // your code here
}
check('rectangle', () => { const r = new Rectangle(3, 4); return [r.area, r.perimeter, `${r}`]; }, [12, 14, '3x4']);
check('square', () => { const s = new Square(5); return [s.area, `${s}`]; }, [25, '5x5']);
check('inheritance', () => new Square(1) instanceof Rectangle, true, Square);

section('5 — BankAccount with a history');
/* #balance and a private #history array.
 *   deposit(n) / withdraw(n) return the new balance
 *   get balance
 *   get history -> a COPY of entries like { type: 'deposit', amount: 50 }
 * withdraw beyond the balance throws 'insufficient funds' and records
 * nothing.                                                       */
class BankAccount {
  // your code here
}
check('records', () => {
  const a = new BankAccount(100);
  a.deposit(50); a.withdraw(30);
  return a.history;
}, [{ type: 'deposit', amount: 50 }, { type: 'withdraw', amount: 30 }]);
check('balance', () => { const a = new BankAccount(100); a.deposit(50); return a.balance; }, 150);
check('history is a copy', () => {
  const a = new BankAccount(100);
  a.deposit(1);
  a.history.push('hacked');
  return a.history.length;
}, 1);
check('failed withdrawal records nothing', () => {
  const a = new BankAccount(10);
  try { a.withdraw(50); } catch { /* expected */ }
  return a.history.length;
}, 0);

section('6 — EventEmitter as a class');
/* on(event, fn) -> an off function ; emit(event, ...args) -> handler count
 * once(event, fn)                                                */
class EventEmitter {
  // your code here
}
check('on and emit', () => {
  const e = new EventEmitter();
  const seen = [];
  e.on('tick', (n) => seen.push(n));
  e.emit('tick', 1); e.emit('tick', 2);
  return seen;
}, [1, 2]);
check('emit returns the count', () => {
  const e = new EventEmitter();
  e.on('a', () => {}); e.on('a', () => {});
  return e.emit('a');
}, 2);
check('unknown event', () => new EventEmitter().emit('nope'), 0);
check('off', () => {
  const e = new EventEmitter();
  const seen = [];
  const off = e.on('x', () => seen.push(1));
  e.emit('x'); off(); e.emit('x');
  return seen.length;
}, 1);
check('once', () => {
  const e = new EventEmitter();
  const seen = [];
  e.once('boot', () => seen.push('ran'));
  e.emit('boot'); e.emit('boot');
  return seen;
}, ['ran']);

section('7 — a linked list');
/* add(value) is chainable ; toArray() ; get length ; and it is iterable.  */
class LinkedList {
  // your code here
}
check('adds', () => new LinkedList().add(1).add(2).toArray(), [1, 2]);
check('length', () => new LinkedList().add(1).length, 1);
check('iterable', () => [...new LinkedList().add('a').add('b')], ['a', 'b']);
check('empty', () => [new LinkedList().toArray(), new LinkedList().length], [[], 0]);

section('8 — a Matrix class');
/* Matrix(rows) where rows is an array of arrays.
 *   get(r, c) ; get rows ; get cols
 *   transpose() -> a new Matrix
 *   toString()  -> rows joined by '\n', cells by ' '             */
class Matrix {
  // your code here
}
const M = [[1, 2, 3], [4, 5, 6]];
check('dimensions', () => { const m = new Matrix(M); return [m.rows, m.cols]; }, [2, 3]);
check('get', () => new Matrix(M).get(1, 2), 6);
check('transpose', () => new Matrix(M).transpose().toString(), '1 4\n2 5\n3 6');
check('transpose returns a Matrix', () => new Matrix(M).transpose() instanceof Matrix, true, Matrix);
check('toString', () => `${new Matrix(M)}`, '1 2 3\n4 5 6');

section('9 — a typed collection');
/* TypedList(Type) only accepts instances of Type.
 *   add(item) throws 'wrong type' otherwise, and is chainable
 *   get size ; and it is iterable                                */
class TypedList {
  // your code here
}
class Animal { constructor(name) { this.name = name; } }
check('accepts', () => {
  const l = new TypedList(Animal);
  l.add(new Animal('a')).add(new Animal('b'));
  return l.size;
}, 2);
check('rejects', () => {
  try { new TypedList(Animal).add('a string'); return 'no throw'; } catch (e) { return e.message; }
}, 'wrong type');
check('iterable', () => [...new TypedList(Animal).add(new Animal('x'))].map((a) => a.name), ['x']);

section('10 — a Timer class with static tracking');
/* Timer(name) records itself in a static registry.
 *   static get count ; static reset() ; static names() -> sorted names  */
class Timer {
  // your code here
}
check('counts', () => {
  Timer.reset();
  new Timer('a'); new Timer('b');
  return Timer.count;
}, 2);
check('names', () => {
  Timer.reset();
  new Timer('z'); new Timer('a');
  return Timer.names();
}, ['a', 'z']);
check('reset', () => { Timer.reset(); return [Timer.count, Timer.names()]; }, [0, []]);

section('11 — Comparable shapes');
/* Shape with an abstract area(). Circle, Sq and Tri implement it.
 *   Circle(r)   -> Math.PI * r * r, rounded to 2 decimals
 *   Sq(s)       -> s * s
 *   Tri(b, h)   -> 0.5 * b * h
 * sortByArea(shapes) returns a new array sorted smallest first.  */
class Shape {
  // your code here
}
class Circle extends Shape {
  // your code here
}
class Sq extends Shape {
  // your code here
}
class Tri extends Shape {
  // your code here
}
function sortByArea(shapes) {
  // your code here
}
check('areas', () => [new Circle(1).area(), new Sq(3).area(), new Tri(4, 2).area()], [3.14, 9, 4]);
check('sorted', () => sortByArea([new Sq(3), new Circle(1), new Tri(4, 2)]).map((s) => s.area()),
  [3.14, 4, 9]);
check('abstract base', () => {
  try { return new Shape().area(); } catch (e) { return e.message; }
}, 'not implemented');

section('12 — a simple state machine');
/* TrafficLight starts 'red'. next() advances red -> green -> yellow -> red
 * and returns the new state. get state. canGo() -> true only on green.  */
class TrafficLight {
  // your code here
}
check('cycle', () => {
  const t = new TrafficLight();
  return [t.state, t.next(), t.next(), t.next()];
}, ['red', 'green', 'yellow', 'red']);
check('canGo', () => {
  const t = new TrafficLight();
  const atRed = t.canGo();
  t.next();
  return [atRed, t.canGo()];
}, [false, true]);

report();

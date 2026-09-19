'use strict';
const { check, section, log, report } = require('../_helpers/check');
const path = require('path');

/* ============================================================================
 * MODULES 01 — COMMONJS
 * Run with:  node 08-modules-and-node/01-commonjs.js
 *
 * Every file in this course except one is a CommonJS module. Node invented
 * the system, npm is full of it, and you will read it for years yet.
 *
 * THE API
 *   module.exports = value          replace the whole export
 *   module.exports.a = 1            add one named export
 *   exports.a = 1                   shorthand for the line above
 *   const m = require('./file')     load and run it, get module.exports
 *
 * THE EXPORTS TRAP — the single most common CommonJS mistake:
 *   `exports` is just a VARIABLE pointing at module.exports. Assigning to
 *   it (`exports = something`) only repoints the local variable; the
 *   module still exports the original object. Adding a property
 *   (`exports.a = 1`) works fine. When in doubt, write `module.exports`.
 *
 * REQUIRE IS
 *   • SYNCHRONOUS — it blocks until the file has run.
 *   • CACHED — the second require of the same path returns the SAME
 *     object without re-running the file. Modules are singletons.
 *   • DYNAMIC — the path can be computed, and it can sit inside an `if`.
 *
 * CIRCULAR REQUIRES do not crash: the second module receives a PARTIALLY
 * filled exports object. That is a design smell, not a feature.
 * ==========================================================================*/

section('Exercise 1 — requiring a built-in');
/* joinPath('a', 'b', 'c.txt') uses the already-required `path` module.
 * -> 'a/b/c.txt' on Linux                                        */
function joinPath(...parts) {
  // your code here
}
check('joins', joinPath('a', 'b', 'c.txt'), path.join('a', 'b', 'c.txt'));
check('normalises', joinPath('a', '..', 'b'), 'b');

section('Exercise 2 — requiring your own file');
/* The folder _fixtures holds shapes.cjs. Require it and use it.
 * Look at the file first — it is five lines.                     */
function useShapes() {
  // your code here: require('./_fixtures/shapes.cjs') and return its area(2)
}
check('imported area', useShapes(), 12.56636);

section('Exercise 3 — require is cached');
/* Requiring twice gives the SAME object, and the module body runs ONCE.
 * shapes.cjs counts its own loads in `loadCount`.
 * cacheProof() requires it twice and returns
 *   [firstIsSecond, loadCount]  ->  [true, 1]                    */
function cacheProof() {
  // your code here
}
check('same object, loaded once', cacheProof(), [true, 1]);

section('Exercise 4 — the exports trap');
/* Two fixture files do almost the same thing.
 *   _fixtures/good-exports.cjs  uses module.exports = ...
 *   _fixtures/broken-exports.cjs uses exports = ...
 * Require both and return [typeof good, typeof broken].
 * -> ['function', 'object']   because the broken one exported nothing  */
function exportsTrap() {
  // your code here
}
check('assigning to `exports` does not work', exportsTrap(), ['function', 'object']);
check('and the broken one is empty', () => Object.keys(require('./_fixtures/broken-exports.cjs')), [], exportsTrap);

section('Exercise 5 — conditional require');
/* Unlike ESM, you can require inside an if.
 * loadIf(useReal) returns the shapes module when true, and a stub object
 * { area: () => 0 } when false.                                  */
function loadIf(useReal) {
  // your code here
}
check('real', () => loadIf(true).area(2), 12.56636);
check('stub', () => loadIf(false).area(2), 0);

section('Exercise 6 — a module registry of your own');
/* Build require() in miniature. makeRegistry() returns
 *   { define(name, factory), require(name) }
 * where factory is a function returning the module's exports, run at most
 * ONCE, with the result cached. Requiring an unknown name throws
 * `cannot find module ${name}`.                                  */
function makeRegistry() {
  // your code here
}
check('defines and requires', () => {
  const r = makeRegistry();
  r.define('math', () => ({ double: (n) => n * 2 }));
  return r.require('math').double(4);
}, 8, makeRegistry);
check('runs the factory once', () => {
  const r = makeRegistry();
  let runs = 0;
  r.define('m', () => { runs++; return {}; });
  r.require('m'); r.require('m');
  return runs;
}, 1, makeRegistry);
check('same object every time', () => {
  const r = makeRegistry();
  r.define('m', () => ({}));
  return r.require('m') === r.require('m');
}, true, makeRegistry);
check('unknown module', () => {
  const r = makeRegistry();
  try { r.require('nope'); return 'no throw'; } catch (e) { return e.message; }
}, 'cannot find module nope', makeRegistry);

section('Exercise 7 — a registry with dependencies');
/* Extend it: define(name, deps, factory) where the factory receives the
 * resolved dependency exports as arguments.                      */
function makeRegistryWithDeps() {
  // your code here
}
check('injects dependencies', () => {
  const r = makeRegistryWithDeps();
  r.define('config', [], () => ({ factor: 3 }));
  r.define('math', ['config'], (config) => ({ scale: (n) => n * config.factor }));
  return r.require('math').scale(4);
}, 12, makeRegistryWithDeps);
check('deep chain', () => {
  const r = makeRegistryWithDeps();
  r.define('a', [], () => 'a');
  r.define('b', ['a'], (a) => `${a}b`);
  r.define('c', ['b'], (b) => `${b}c`);
  return r.require('c');
}, 'abc', makeRegistryWithDeps);

section('Exercise 8 — detecting a cycle');
/* A registry that THROWS on a circular dependency instead of handing back
 * a half-built module. Message: `circular dependency: ${name}`.  */
function makeSafeRegistry() {
  // your code here
}
check('normal still works', () => {
  const r = makeSafeRegistry();
  r.define('a', [], () => 'a');
  r.define('b', ['a'], (a) => `${a}b`);
  return r.require('b');
}, 'ab', makeSafeRegistry);
check('detects a cycle', () => {
  const r = makeSafeRegistry();
  r.define('a', ['b'], (b) => `a${b}`);
  r.define('b', ['a'], (a) => `b${a}`);
  try { r.require('a'); return 'no throw'; } catch (e) { return e.message; }
}, 'circular dependency: a', makeSafeRegistry);

section('Exercise 9 — the module wrapper');
/* Node wraps every file in a function before running it, which is where
 * `module`, `exports`, `require`, `__dirname` and `__filename` come from.
 * moduleGlobals() returns the sorted list of those five names that are
 * actually defined in THIS file.                                 */
function moduleGlobals() {
  // your code here
}
check('all five exist', moduleGlobals(),
  ['__dirname', '__filename', 'exports', 'module', 'require']);

section('PREDICTIONS');

// P1: is require synchronous?
let p1 = null;
check('P1  does require() return before the file has finished running?', p1, false);

// P2: how many times does a module body run for three requires?
let p2 = null;
check('P2  module body executions for three requires of one file', p2, 1);

// P3: what is module.exports before you assign anything?
let p3 = null;
check('P3  the initial value of module.exports', p3, 'an empty object');

// P4: does `exports.a = 1` work?
let p4 = null;
check('P4  does `exports.a = 1` export a?', p4, true);

// P5: and `exports = { a: 1 }`?
let p5 = null;
check('P5  does `exports = { a: 1 }` export a?', p5, false);

// P6: is __dirname available in an ES module?
let p6 = null;
check('P6  is __dirname defined in a .mjs file?', p6, false);

log('the summary', 'CommonJS: synchronous, cached, dynamic, and copies values');

report();

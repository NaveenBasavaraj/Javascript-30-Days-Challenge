import checkPkg from '../_helpers/check.js';
const { check, checkAsync, section, log, report } = checkPkg;

/* ============================================================================
 * MODULES 02 — ES MODULES
 * Run with:  node 08-modules-and-node/02-esm.mjs
 *
 * This file has the .mjs extension, so Node treats it as an ES module and
 * `import` / `export` work. (The rest of the course is CommonJS, which is
 * why they use `require`.)
 *
 * THE SYNTAX
 *   export const a = 1;              a named export
 *   export function f() {}
 *   export { a, f };                 export a list
 *   export { a as alias };           rename on the way out
 *   export default thing;            ONE default per module
 *
 *   import { a, f } from './m.js';   named imports, names must match
 *   import { a as b } from './m.js'; rename on the way in
 *   import thing from './m.js';      the default, name it what you like
 *   import * as m from './m.js';     everything as one namespace object
 *   import './m.js';                 run it for its side effects only
 *
 * HOW ESM DIFFERS FROM COMMONJS — this is what gets asked in interviews:
 *   • STATIC. Imports are resolved before any code runs, so you cannot
 *     `import` conditionally. Use `await import()` for that.
 *   • HOISTED. Every import is processed before the module body executes.
 *   • LIVE BINDINGS. You import a REFERENCE, not a copy. If the exporting
 *     module changes the value later, you see the change. `require` copies.
 *   • READ-ONLY. You cannot assign to an imported binding.
 *   • Top-level `await` is allowed.
 *   • Always strict mode, and `this` at the top level is undefined.
 *   • File extensions are REQUIRED in relative specifiers.
 * ==========================================================================*/

/* The exercises import from ./_fixtures/ — read those two small files
 * first, they are only a few lines each. */
import { PI, area, counter, bump } from './_fixtures/shapes.mjs';
import defaultGreeting from './_fixtures/greet.mjs';
import * as greetModule from './_fixtures/greet.mjs';

section('Exercise 1 — named imports');
/* usePi() returns the imported PI, and useArea(r) calls the imported
 * area(r). Both are already imported above — just use them.      */
function usePi() {
  // your code here
}
function useArea(r) {
  // your code here
}
check('PI', usePi(), 3.14159);
check('area', useArea(2), 12.56636);

section('Exercise 2 — the default export');
/* useDefault(name) calls the default import with the name.
 * defaultGreeting('Asha') -> 'Hello, Asha'                       */
function useDefault(name) {
  // your code here
}
check('default export', useDefault('Asha'), 'Hello, Asha');

section('Exercise 3 — the namespace object');
/* namespaceKeys() returns the SORTED keys of greetModule.
 * A default export appears under the key 'default'.              */
function namespaceKeys() {
  // your code here
}
check('namespace contents', namespaceKeys(), ['default', 'shout']);

section('Exercise 4 — live bindings');
/* `counter` is exported by shapes.mjs and changed by bump().
 * showLiveBinding() calls bump() twice and returns the CURRENT value of
 * the imported `counter`.
 * With CommonJS you would still see the old value — this is the real
 * difference between the two systems.                            */
function showLiveBinding() {
  // your code here
}
check('the import tracks the change', showLiveBinding(), 2);

section('Exercise 5 — imports are read-only');
/* tryToReassign() attempts `PI = 3` inside a try/catch and returns the
 * error constructor name.                                        */
function tryToReassign() {
  // your code here
}
check('cannot assign to an import', tryToReassign(), 'TypeError');

section('Exercise 6 — dynamic import');
/* loadShout() uses `await import(...)` to load ./_fixtures/greet.mjs at
 * RUNTIME and returns its shout('hi') result.
 * This is how you code-split and how you import conditionally.   */
async function loadShout() {
  // your code here
}
checkAsync('dynamic import', async () => await loadShout(), 'HI!', loadShout);

section('Exercise 7 — import order');
/* Imports are hoisted and run BEFORE the module body.
 * ./_fixtures/side-effect.mjs pushes 'module loaded' into a shared array
 * when it is imported. It was imported at the top of this file... except
 * it was not. Import it dynamically and show the difference.
 * importOrder() returns ['body ran', 'module loaded'].           */
export const ORDER = [];
ORDER.push('body ran');
async function importOrder() {
  // your code here: await import the side-effect module, then return ORDER
}
checkAsync('dynamic imports run later', async () => await importOrder(), ['body ran', 'module loaded'], importOrder);

section('Exercise 8 — top-level await');
/* Allowed in ESM only. TOP_LEVEL is assigned with a top-level await.
 * Replace the null below with `await Promise.resolve('awaited')`.  */
const TOP_LEVEL = null;
check('top-level await works here', TOP_LEVEL, 'awaited');

section('PREDICTIONS');

// P1: what is `this` at the top level of an ES module?
let p1 = null;
check('P1  String(this) at module top level', p1, String(undefined));

// P2: can you import conditionally with a static import?
let p2 = null;
check('P2  is `if (x) import "./a.js"` valid?', p2, false);

// P3: does an ESM import copy the value or reference it?
let p3 = null;
check('P3  ESM imports are', p3, 'live references');

// P4: and CommonJS require?
let p4 = null;
check('P4  require() gives you', p4, 'a copy of the value at that moment');

// P5: is the file extension optional in a relative ESM import?
let p5 = null;
check('P5  is `import x from "./thing"` valid in Node ESM?', p5, false);

log('the rule of thumb', 'write ESM for new code; you still must read CommonJS everywhere');

report();

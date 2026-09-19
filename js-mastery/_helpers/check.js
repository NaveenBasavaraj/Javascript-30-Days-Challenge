'use strict';
/* ============================================================================
 * Tiny test harness. You never need to edit this file.
 * Every exercise file imports `check` / `report` from here and runs itself.
 * ==========================================================================*/
const util = require('util');

const C = {
  green: '\x1b[32m', red: '\x1b[31m', yellow: '\x1b[33m',
  cyan: '\x1b[36m', dim: '\x1b[2m', bold: '\x1b[1m', off: '\x1b[0m',
};

let passed = 0, failed = 0, skipped = 0;
const failures = [];
let chain = Promise.resolve();

function isObj(v) { return v !== null && typeof v === 'object'; }

function deepEqual(a, b) {
  if (Object.is(a, b)) return true;
  if (!isObj(a) || !isObj(b)) return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  if (a instanceof Date || b instanceof Date) {
    return a instanceof Date && b instanceof Date && a.getTime() === b.getTime();
  }
  if (a instanceof Set && b instanceof Set) {
    if (a.size !== b.size) return false;
    return [...a].every((v) => b.has(v));
  }
  if (a instanceof Map && b instanceof Map) {
    if (a.size !== b.size) return false;
    return [...a].every(([k, v]) => b.has(k) && deepEqual(v, b.get(k)));
  }
  const ak = Object.keys(a), bk = Object.keys(b);
  if (ak.length !== bk.length) return false;
  return ak.every((k) => Object.prototype.hasOwnProperty.call(b, k) && deepEqual(a[k], b[k]));
}

/** True when a function body is still empty / only comments. */
function isStub(fn) {
  if (typeof fn !== 'function') return false;
  // Strip comments FIRST: a hint like `// use balance() here` would
  // otherwise derail the parameter-list scan below.
  const src = fn.toString()
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/[^\n]*/g, '');

  // Find where the body starts. Skipping the parameter list matters:
  // `function f({ a } = {}) {}` has braces in its parameters too.
  let bodyStart = -1;
  const paren = src.indexOf('(');
  if (paren === -1) {
    bodyStart = src.indexOf('{');                 // e.g.  x => { ... }
  } else {
    let depth = 0;
    for (let i = paren; i < src.length; i++) {
      if (src[i] === '(') depth++;
      else if (src[i] === ')') {
        depth--;
        if (depth === 0) { bodyStart = src.indexOf('{', i); break; }
      }
    }
  }
  if (bodyStart === -1) return false;             // concise arrow body: real code

  return src.slice(bodyStart + 1, src.lastIndexOf('}')).trim() === '';
}

function show(v) {
  return util.inspect(v, { depth: 5, breakLength: 90, compact: true });
}

/**
 * check(label, actual, expected)
 * Leaving a function unwritten makes `actual` undefined -> reported as TODO.
 *
 * `actual` may also be a thunk: check('x', () => f(1).map(g), expected)
 * The thunk is called inside a try/catch, so an unwritten exercise reports
 * as TODO instead of crashing the whole file.
 *
 * `sourceFn` is the exercise's own function. Pass it when the expected
 * answer is itself undefined-ish, so an empty stub reports TODO instead of
 * passing by accident.
 */
function check(label, actual, expected, sourceFn) {
  // Naming a sourceFn is a promise that the function exists, so an
  // undefined result is a real failure rather than "not written yet".
  const explicit = sourceFn !== undefined;
  if (isStub(sourceFn)) {
    skipped++;
    console.log(`  ${C.yellow}\u25cb TODO${C.off} ${label} ${C.dim}(not written yet)${C.off}`);
    return false;
  }
  if (typeof actual === 'function' && typeof expected !== 'function') {
    try {
      actual = actual();
    } catch (err) {
      if (/of undefined|of null|is not a function|is not iterable|undefined or null/.test(err.message)) {
        skipped++;
        console.log(`  ${C.yellow}\u25cb TODO${C.off} ${label} ${C.dim}(not written yet)${C.off}`);
      } else {
        failed++;
        failures.push(label);
        console.log(`  ${C.red}\u2718 ${label}${C.off}`);
        console.log(`      ${C.dim}threw:${C.off} ${err.name}: ${err.message}`);
      }
      return false;
    }
  }
  if (!explicit && actual === undefined && expected !== undefined) {
    skipped++;
    console.log(`  ${C.yellow}○ TODO${C.off} ${label} ${C.dim}(not written yet)${C.off}`);
    return false;
  }
  if (deepEqual(actual, expected)) {
    passed++;
    console.log(`  ${C.green}✔${C.off} ${label}`);
    return true;
  }
  failed++;
  failures.push(label);
  console.log(`  ${C.red}✘ ${label}${C.off}`);
  console.log(`      ${C.dim}expected:${C.off} ${show(expected)}`);
  console.log(`      ${C.dim}actual:  ${C.off} ${show(actual)}`);
  return false;
}

/**
 * Async twin of check(), for exercises involving timers or promises.
 *   await checkAsync('debounce fires once', async () => {...}, 1)
 * Results print when they settle; report() waits for all of them.
 */
function checkAsync(label, thunk, expected, sourceFn) {
  // Queued, not parallel: each async check waits for the previous one, so
  // results print in file order and timer-based exercises cannot interfere
  // with each other.
  chain = chain.then(async () => {
    if (isStub(sourceFn)) {
      skipped++;
      console.log(`  ${C.yellow}\u25cb TODO${C.off} ${label} ${C.dim}(not written yet)${C.off}`);
      return;
    }
    let actual;
    try {
      actual = await thunk();
    } catch (err) {
      if (/of undefined|of null|is not a function|is not iterable|undefined or null/.test(err.message)) {
        skipped++;
        console.log(`  ${C.yellow}\u25cb TODO${C.off} ${label} ${C.dim}(not written yet)${C.off}`);
      } else {
        failed++;
        failures.push(label);
        console.log(`  ${C.red}\u2718 ${label}${C.off}`);
        console.log(`      ${C.dim}threw:${C.off} ${err.name}: ${err.message}`);
      }
      return;
    }
    check(label, actual, expected);
  });
  return chain;
}

/** Pause inside an async exercise: await sleep(30) */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Prints a heading between exercise groups. */
function section(title) {
  console.log(`\n${C.bold}${C.cyan}${title}${C.off}`);
}

/** Just print something while exploring. */
function log(label, value) {
  console.log(`  ${C.dim}${label} =${C.off} ${show(value)}`);
}

/** Call once at the bottom of a file. Waits for any checkAsync results. */
async function report() {
  await chain;
  const total = passed + failed + skipped;
  console.log(`\n${C.bold}────────────────────────────────────────${C.off}`);
  console.log(
    `  ${C.green}${passed} passed${C.off}  ` +
    `${failed ? C.red : C.dim}${failed} failed${C.off}  ` +
    `${skipped ? C.yellow : C.dim}${skipped} todo${C.off}  ${C.dim}(of ${total})${C.off}`
  );
  if (failed === 0 && skipped === 0 && total > 0) {
    console.log(`  ${C.green}${C.bold}All done. Move to the next file.${C.off}`);
  } else if (failures.length) {
    console.log(`  ${C.dim}fix: ${failures.slice(0, 5).join(', ')}${failures.length > 5 ? ', …' : ''}${C.off}`);
  }
  if (process.env.JSM_SUMMARY) {
    console.log(`##SUMMARY ${JSON.stringify({ passed, failed, skipped, total })}`);
  }
  console.log('');
}

module.exports = { check, checkAsync, sleep, section, log, report, deepEqual, isStub };

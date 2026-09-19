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

function isObj(v) { return v !== null && typeof v === 'object'; }

function deepEqual(a, b) {
  if (Object.is(a, b)) return true;
  if (!isObj(a) || !isObj(b)) return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
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
 */
function check(label, actual, expected) {
  if (typeof actual === 'function' && typeof expected !== 'function') {
    try {
      actual = actual();
    } catch (err) {
      if (/of undefined|of null|is not a function|is not iterable/.test(err.message)) {
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
  if (actual === undefined && expected !== undefined) {
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

/** Prints a heading between exercise groups. */
function section(title) {
  console.log(`\n${C.bold}${C.cyan}${title}${C.off}`);
}

/** Just print something while exploring. */
function log(label, value) {
  console.log(`  ${C.dim}${label} =${C.off} ${show(value)}`);
}

/** Call once at the bottom of a file. */
function report() {
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

module.exports = { check, section, log, report, deepEqual };

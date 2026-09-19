'use strict';
const { check, section, log, report } = require('../_helpers/check');

/* ============================================================================
 * MODULES 05 — PACKAGES, npm & SEMVER
 *
 * package.json is the contract for a project. The fields that matter:
 *   name, version             identity
 *   type                      "module" makes .js files ESM; default is CJS
 *   main / exports            what `require('pkg')` resolves to
 *   scripts                   `npm run <name>`
 *   dependencies              needed AT RUNTIME
 *   devDependencies           needed only to build and test
 *   peerDependencies          "I work with this, YOU install it"
 *
 * SEMVER — MAJOR.MINOR.PATCH
 *   MAJOR  a breaking change
 *   MINOR  a new feature, backwards compatible
 *   PATCH  a bug fix, backwards compatible
 *
 * THE RANGE SYMBOLS, which cause real outages when misread:
 *   ^1.2.3   any 1.x.x at or above 1.2.3    (MINOR and PATCH may move)
 *   ~1.2.3   any 1.2.x at or above 1.2.3    (PATCH only)
 *   1.2.3    exactly that
 *   >=1.2.3  that or newer
 *   *        anything
 *   ^0.2.3   SPECIAL CASE: below 1.0.0, ^ only allows PATCH — 0.x is
 *            treated as unstable, so a minor bump may break you.
 *
 * package-lock.json records the exact tree actually installed. Commit it.
 * `npm ci` installs exactly the lock file; `npm install` may update it.
 *
 * No network is used in this file — you implement the logic yourself.
 * ==========================================================================*/

section('Exercise 1 — parsing a version');
/* parseVersion('1.2.3') -> { major: 1, minor: 2, patch: 3 }
 * Anything malformed returns null.                               */
function parseVersion(v) {
  // your code here
}
check('normal', parseVersion('1.2.3'), { major: 1, minor: 2, patch: 3 });
check('double digits', parseVersion('10.20.30'), { major: 10, minor: 20, patch: 30 });
check('too few parts', parseVersion('1.2'), null);
check('not numbers', parseVersion('a.b.c'), null);

section('Exercise 2 — comparing versions');
/* compareVersions(a, b) -> -1, 0 or 1. Compare NUMERICALLY, so
 * '1.10.0' is newer than '1.9.0'.                                */
function compareVersions(a, b) {
  // your code here
}
check('newer patch', compareVersions('1.2.10', '1.2.9'), 1);
check('older minor', compareVersions('1.9.0', '1.10.0'), -1);
check('equal', compareVersions('2.0.0', '2.0.0'), 0);
check('major wins', compareVersions('2.0.0', '1.99.99'), 1);

section('Exercise 3 — sorting versions');
/* sortVersions(list) returns them oldest first.                  */
function sortVersions(list) {
  // your code here
}
check('sorted', sortVersions(['1.10.0', '1.2.0', '2.0.0', '1.2.10']),
  ['1.2.0', '1.2.10', '1.10.0', '2.0.0']);
check('empty', sortVersions([]), []);

section('Exercise 4 — the latest version');
/* latest(list) returns the newest, or null for an empty list.    */
function latest(list) {
  // your code here
}
check('latest', latest(['1.0.0', '1.10.2', '1.9.9']), '1.10.2');
check('empty', latest([]), null);

section('Exercise 5 — what kind of bump is it?');
/* bumpType('1.2.3', '2.0.0') -> 'major'
 * bumpType('1.2.3', '1.3.0') -> 'minor'
 * bumpType('1.2.3', '1.2.4') -> 'patch'
 * bumpType('1.2.3', '1.2.3') -> 'none'
 * A DOWNGRADE returns 'downgrade'.                               */
function bumpType(from, to) {
  // your code here
}
check('major', bumpType('1.2.3', '2.0.0'), 'major');
check('minor', bumpType('1.2.3', '1.3.0'), 'minor');
check('patch', bumpType('1.2.3', '1.2.4'), 'patch');
check('none', bumpType('1.2.3', '1.2.3'), 'none');
check('downgrade', bumpType('2.0.0', '1.9.9'), 'downgrade');

section('Exercise 6 — bumping');
/* bump('1.2.3', 'minor') -> '1.3.0'
 * A minor bump zeroes the patch; a major bump zeroes both.       */
function bump(version, kind) {
  // your code here
}
check('patch', bump('1.2.3', 'patch'), '1.2.4');
check('minor resets patch', bump('1.2.3', 'minor'), '1.3.0');
check('major resets both', bump('1.2.3', 'major'), '2.0.0');

section('Exercise 7 — caret ranges');
/* satisfiesCaret(version, range) for '^1.2.3':
 *   allowed when major matches AND the version is >= the range base.
 * Remember the 0.x special case: for '^0.2.3' the MINOR must match too. */
function satisfiesCaret(version, range) {
  // your code here
}
check('same minor', satisfiesCaret('1.2.5', '^1.2.3'), true);
check('higher minor', satisfiesCaret('1.5.0', '^1.2.3'), true);
check('lower patch', satisfiesCaret('1.2.2', '^1.2.3'), false);
check('different major', satisfiesCaret('2.0.0', '^1.2.3'), false);
check('zero major, same minor', satisfiesCaret('0.2.5', '^0.2.3'), true);
check('zero major, different minor', satisfiesCaret('0.3.0', '^0.2.3'), false);

section('Exercise 8 — tilde ranges');
/* satisfiesTilde('1.2.5', '~1.2.3') -> true
 * Only the patch may move.                                       */
function satisfiesTilde(version, range) {
  // your code here
}
check('higher patch', satisfiesTilde('1.2.9', '~1.2.3'), true);
check('lower patch', satisfiesTilde('1.2.1', '~1.2.3'), false);
check('higher minor', satisfiesTilde('1.3.0', '~1.2.3'), false);

section('Exercise 9 — resolving an install');
/* resolve(available, range) picks the HIGHEST available version matching
 * the range, or null. Support '^', '~', 'x.y.z' and '*'.         */
function resolve(available, range) {
  // your code here
}
const AVAILABLE = ['1.0.0', '1.2.3', '1.2.9', '1.5.0', '2.0.0', '2.1.0'];
check('caret picks the newest in the major', resolve(AVAILABLE, '^1.2.3'), '1.5.0');
check('tilde stays in the minor', resolve(AVAILABLE, '~1.2.3'), '1.2.9');
check('exact', resolve(AVAILABLE, '1.2.3'), '1.2.3');
check('star picks the newest of all', resolve(AVAILABLE, '*'), '2.1.0');
check('nothing matches', resolve(AVAILABLE, '^3.0.0'), null);

section('Exercise 10 — reading a package.json');
/* dependencyList(pkg) returns every dependency name from `dependencies`
 * and `devDependencies`, sorted, with no duplicates.
 * runtimeOnly(pkg) returns just the runtime ones, sorted.        */
const PKG = {
  name: 'my-app',
  version: '1.0.0',
  dependencies: { react: '^18.2.0', lodash: '~4.17.21' },
  devDependencies: { vitest: '^1.0.0', react: '^18.2.0' },
};
function dependencyList(pkg) {
  // your code here
}
function runtimeOnly(pkg) {
  // your code here
}
check('all, deduped', dependencyList(PKG), ['lodash', 'react', 'vitest']);
check('runtime only', runtimeOnly(PKG), ['lodash', 'react']);
check('no dependencies at all', dependencyList({ name: 'x' }), []);

section('Exercise 11 — a lock file check');
/* outdated(pkg, installed) returns the names whose INSTALLED version no
 * longer satisfies the range in package.json, sorted.
 * Support '^' and '~' and exact.                                 */
function outdated(pkg, installed) {
  // your code here
}
check('all fine', outdated(PKG, { react: '18.3.0', lodash: '4.17.25' }), []);
check('one drifted', outdated(PKG, { react: '17.0.0', lodash: '4.17.25' }), ['react']);
check('tilde violated', outdated(PKG, { react: '18.3.0', lodash: '4.18.0' }), ['lodash']);

section('Exercise 12 — script resolution');
/* runScript(pkg, name) returns the command string, or throws
 * `missing script: ${name}`.                                     */
function runScript(pkg, name) {
  // your code here
}
const WITH_SCRIPTS = { scripts: { test: 'vitest', build: 'tsc' } };
check('found', runScript(WITH_SCRIPTS, 'test'), 'vitest');
check('missing', () => {
  try { runScript(WITH_SCRIPTS, 'deploy'); return 'no throw'; } catch (e) { return e.message; }
}, 'missing script: deploy', runScript);

section('PREDICTIONS');

// P1: which part changes for a breaking change?
let p1 = null;
check('P1  a breaking change bumps the', p1, 'major');

// P2: does ^1.2.3 allow 1.9.0?
let p2 = null;
check('P2  does ^1.2.3 allow 1.9.0?', p2, true);

// P3: does ^0.2.3 allow 0.3.0?
let p3 = null;
check('P3  does ^0.2.3 allow 0.3.0?', p3, false);

// P4: which dependencies ship to production?
let p4 = null;
check('P4  the field whose packages are needed at runtime', p4, 'dependencies');

// P5: should package-lock.json be committed?
let p5 = null;
check('P5  commit package-lock.json?', p5, true);

// P6: what does "type": "module" change?
let p6 = null;
check('P6  "type": "module" makes .js files', p6, 'ES modules');

log('the practical takeaway', '^ is the default npm writes, and it is why builds drift');

report();

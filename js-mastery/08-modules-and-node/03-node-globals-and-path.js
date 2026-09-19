'use strict';
const { check, section, log, report } = require('../_helpers/check');
const path = require('path');
const os = require('os');

/* ============================================================================
 * MODULES 03 — NODE GLOBALS & PATHS
 *
 * Node gives you globals the browser does not, and withholds ones it has.
 * There is no `window`, no `document`, no `localStorage`. Instead:
 *
 *   process.argv       the command line, as an array
 *                      [0] node's path, [1] your script, [2...] real args
 *   process.env        environment variables, always STRINGS
 *   process.exit(code) stop now (0 = success). Avoid it in libraries.
 *   process.cwd()      where the process was started
 *   __dirname          the folder of the CURRENT FILE (CommonJS only)
 *   globalThis         the global object, in every environment
 *
 * PATHS — never build them with string concatenation.
 *   path.join(a, b)        joins and normalises ('a', '..', 'b') -> 'b'
 *   path.resolve(a, b)     produces an ABSOLUTE path
 *   path.basename(p, ext)  the file name, optionally without its extension
 *   path.dirname(p)        the folder
 *   path.extname(p)        '.txt'
 *   path.parse(p)          { root, dir, base, ext, name }
 *   path.relative(from, to)
 *   path.sep               '/' or '\\'
 *
 * The difference that matters: join CONCATENATES, resolve ANCHORS. Given
 * a leading '/', resolve throws away everything before it.
 * ==========================================================================*/

section('Exercise 1 — join vs resolve');
/* joined('a', 'b') -> 'a/b'
 * resolved('a', 'b') is absolute, so it starts with '/'.         */
function joined(...parts) {
  // your code here
}
function resolved(...parts) {
  // your code here
}
check('join is relative', joined('a', 'b'), path.join('a', 'b'));
check('resolve is absolute', () => path.isAbsolute(resolved('a', 'b')), true, resolved);
check('join normalises', joined('a', '..', 'b', './c'), path.join('a', '..', 'b', './c'));

section('Exercise 2 — picking a path apart');
/* describePath('/home/user/notes.txt') ->
 *   { dir: '/home/user', base: 'notes.txt', name: 'notes', ext: '.txt' }  */
function describePath(p) {
  // your code here
}
check('parts', describePath('/home/user/notes.txt'),
  { dir: '/home/user', base: 'notes.txt', name: 'notes', ext: '.txt' });
check('no extension', describePath('/a/README'),
  { dir: '/a', base: 'README', name: 'README', ext: '' });

section('Exercise 3 — changing an extension');
/* withExtension('/a/b/report.txt', '.md') -> '/a/b/report.md'    */
function withExtension(p, newExt) {
  // your code here
}
check('swaps', withExtension('/a/b/report.txt', '.md'), path.join('/a/b', 'report.md'));
check('adds when missing', withExtension('/a/b/report', '.md'), path.join('/a/b', 'report.md'));

section('Exercise 4 — safe joining');
/* A user supplies a filename; do not let them escape the folder.
 * safeJoin('/base', 'notes.txt')      -> '/base/notes.txt'
 * safeJoin('/base', '../../etc/pw')   -> null   (escapes the base)
 * Use path.resolve and check the result still starts with the base.  */
function safeJoin(base, userPath) {
  // your code here
}
check('normal', safeJoin('/base', 'notes.txt'), path.resolve('/base', 'notes.txt'));
check('nested is fine', safeJoin('/base', 'sub/notes.txt'), path.resolve('/base', 'sub/notes.txt'));
check('escape attempt', safeJoin('/base', '../../etc/passwd'), null);
check('absolute escape attempt', safeJoin('/base', '/etc/passwd'), null);

section('Exercise 5 — relative paths');
/* relativeTo('/a/b/c', '/a/d/e.txt') -> '../../d/e.txt'          */
function relativeTo(from, to) {
  // your code here
}
check('up and over', relativeTo('/a/b/c', '/a/d/e.txt'), path.relative('/a/b/c', '/a/d/e.txt'));
check('same folder', relativeTo('/a/b', '/a/b/c.txt'), 'c.txt');

section('Exercise 6 — this file');
/* whereAmI() returns the BASE NAME of the current file, using __filename.
 * folderName() returns the base name of its folder, using __dirname.  */
function whereAmI() {
  // your code here
}
function folderName() {
  // your code here
}
check('file', whereAmI(), '03-node-globals-and-path.js');
check('folder', folderName(), '08-modules-and-node');

section('Exercise 7 — the environment');
/* readEnv(name, fallback) reads process.env, returning the fallback when
 * the variable is missing OR an empty string.
 * Remember env values are always strings.                        */
function readEnv(name, fallback) {
  // your code here
}
check('missing', readEnv('DEFINITELY_NOT_SET_12345', 'fallback'), 'fallback');
check('present', () => {
  process.env.JSM_TEST_VAR = 'hello';
  const v = readEnv('JSM_TEST_VAR', 'fallback');
  delete process.env.JSM_TEST_VAR;
  return v;
}, 'hello', readEnv);
check('empty counts as missing', () => {
  process.env.JSM_EMPTY = '';
  const v = readEnv('JSM_EMPTY', 'fallback');
  delete process.env.JSM_EMPTY;
  return v;
}, 'fallback', readEnv);

section('Exercise 8 — typed environment values');
/* envNumber(name, fallback) parses the variable as a number, falling back
 * when it is missing or not a valid number.
 * envBool(name) is true only for the exact strings 'true' or '1'.  */
function envNumber(name, fallback) {
  // your code here
}
function envBool(name) {
  // your code here
}
check('number', () => {
  process.env.JSM_PORT = '8080';
  const v = envNumber('JSM_PORT', 3000);
  delete process.env.JSM_PORT;
  return v;
}, 8080, envNumber);
check('bad number falls back', () => {
  process.env.JSM_PORT = 'abc';
  const v = envNumber('JSM_PORT', 3000);
  delete process.env.JSM_PORT;
  return v;
}, 3000, envNumber);
check('missing falls back', envNumber('JSM_NOPE_999', 3000), 3000);
check('bool true', () => {
  process.env.JSM_FLAG = 'true';
  const v = envBool('JSM_FLAG');
  delete process.env.JSM_FLAG;
  return v;
}, true, envBool);
check('bool one', () => {
  process.env.JSM_FLAG = '1';
  const v = envBool('JSM_FLAG');
  delete process.env.JSM_FLAG;
  return v;
}, true, envBool);
check('anything else is false', () => {
  process.env.JSM_FLAG = 'yes';
  const v = envBool('JSM_FLAG');
  delete process.env.JSM_FLAG;
  return v;
}, false, envBool);

section('Exercise 9 — parsing command-line arguments');
/* parseArgs(argv) takes the REAL arguments (what process.argv.slice(2)
 * gives) and returns { flags, options, positional }.
 *   '--verbose'     -> flags.verbose = true
 *   '--out=dist'    -> options.out = 'dist'
 *   '--out dist'    -> options.out = 'dist'   (next token is the value)
 *   'file.txt'      -> positional                                */
function parseArgs(argv) {
  // your code here
}
check('flags', parseArgs(['--verbose']), { flags: { verbose: true }, options: {}, positional: [] });
check('equals form', parseArgs(['--out=dist']), { flags: {}, options: { out: 'dist' }, positional: [] });
check('space form', parseArgs(['--out', 'dist']), { flags: {}, options: { out: 'dist' }, positional: [] });
check('positional', parseArgs(['a.txt', 'b.txt']),
  { flags: {}, options: {}, positional: ['a.txt', 'b.txt'] });
check('mixed', parseArgs(['build', '--out', 'dist', '--verbose', 'extra']), {
  flags: { verbose: true },
  options: { out: 'dist' },
  positional: ['build', 'extra'],
});
check('empty', parseArgs([]), { flags: {}, options: {}, positional: [] });

section('Exercise 10 — the temp folder');
/* tempPath(name) returns a path inside the operating system's temp
 * directory, using os.tmpdir().                                  */
function tempPath(name) {
  // your code here
}
check('inside tmpdir', () => tempPath('x.txt').startsWith(os.tmpdir()), true, tempPath);
check('ends with the name', () => path.basename(tempPath('x.txt')), 'x.txt', tempPath);

section('PREDICTIONS');

// P1: what is at process.argv[0]?
let p1 = null;
check('P1  process.argv[0] is', p1, "node's own executable path");

// P2: the type of an environment variable
process.env.JSM_NUM = '42';
let p2 = null;
check('P2  typeof process.env.JSM_NUM', p2, typeof process.env.JSM_NUM);
delete process.env.JSM_NUM;

// P3: join vs resolve with a leading slash
let p3 = null;
check('P3  path.join("a", "/b")', p3, path.join('a', '/b'));

// P4: and resolve
let p4 = null;
check('P4  path.resolve("a", "/b")', p4, path.resolve('a', '/b'));

// P5: does __dirname change with the working directory?
let p5 = null;
check('P5  is __dirname the file location or the cwd?', p5, 'the file location');

// P6: is `window` defined in Node?
let p6 = null;
check('P6  typeof window in Node', p6, typeof window); // eslint-disable-line no-undef

report();

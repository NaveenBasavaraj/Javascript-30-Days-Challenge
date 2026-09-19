'use strict';
const { check, checkAsync, sleep, section, log, report } = require('../_helpers/check');
const fs = require('fs/promises');
const fsSync = require('fs');
const path = require('path');
const os = require('os');

/* ============================================================================
 * MODULES 04 — THE FILE SYSTEM
 *
 * Everything here writes into a temporary folder that is created when the
 * file starts and deleted when it ends. Nothing touches your project.
 *
 * THREE APIS, one of which you should use:
 *   require('fs/promises')   async, promise-based   <- use this
 *   require('fs')            callback-based, older
 *   require('fs').xxxSync    synchronous; fine in a CLI at startup,
 *                            never inside a server request
 *
 * THE CALLS YOU NEED
 *   readFile(p, 'utf8')      the contents as a string
 *                            (without the encoding you get a Buffer)
 *   writeFile(p, text)       creates or OVERWRITES
 *   appendFile(p, text)      adds to the end
 *   mkdir(p, { recursive: true })   makes parents too, no error if it exists
 *   readdir(p)               the names inside a folder
 *   stat(p)                  size, times, isFile(), isDirectory()
 *   rm(p, { recursive: true, force: true })   delete
 *   access(p)                throws if it does not exist
 *
 * THERE IS NO `exists`. The honest way is to try the operation and catch
 * the error — checking first is a race condition. Error codes matter:
 *   ENOENT  no such file      EACCES  permission denied
 *   EEXIST  already exists    EISDIR  it is a directory
 * ==========================================================================*/

const TMP = path.join(os.tmpdir(), `jsm-fs-${process.pid}`);
fsSync.mkdirSync(TMP, { recursive: true });
process.on('exit', () => fsSync.rmSync(TMP, { recursive: true, force: true }));
const at = (name) => path.join(TMP, name);

section('Exercise 1 — write and read');
/* save(name, text) writes the file. load(name) reads it back as a string. */
async function save(name, text) {
  // your code here
}
async function load(name) {
  // your code here
}
checkAsync('round trip', async () => {
  await save(at('note.txt'), 'hello');
  return await load(at('note.txt'));
}, 'hello', save);
checkAsync('overwrites', async () => {
  await save(at('note.txt'), 'first');
  await save(at('note.txt'), 'second');
  return await load(at('note.txt'));
}, 'second', save);

section('Exercise 2 — without an encoding you get a Buffer');
/* rawRead(name) reads with NO encoding and returns the constructor name
 * of what comes back.                                            */
async function rawRead(name) {
  // your code here
}
checkAsync('a Buffer', async () => {
  await save(at('raw.txt'), 'abc');
  return await rawRead(at('raw.txt'));
}, 'Buffer', rawRead);

section('Exercise 3 — appending');
/* appendLine(name, line) adds the line plus '\n' to the end.     */
async function appendLine(name, line) {
  // your code here
}
checkAsync('appends', async () => {
  await save(at('log.txt'), '');
  await appendLine(at('log.txt'), 'one');
  await appendLine(at('log.txt'), 'two');
  return await load(at('log.txt'));
}, 'one\ntwo\n', appendLine);

section('Exercise 4 — does it exist?');
/* exists(p) returns true or false, never throwing. Use access() in a
 * try/catch — there is no fs.exists in the promises API.         */
async function exists(p) {
  // your code here
}
checkAsync('present', async () => {
  await save(at('here.txt'), 'x');
  return await exists(at('here.txt'));
}, true, exists);
checkAsync('absent', async () => await exists(at('nope.txt')), false, exists);

section('Exercise 5 — reading a missing file');
/* loadOrDefault(p, fallback) returns the contents, or the fallback when
 * the file does not exist. Any OTHER error must still be thrown — check
 * error.code === 'ENOENT'.                                       */
async function loadOrDefault(p, fallback) {
  // your code here
}
checkAsync('present', async () => {
  await save(at('config.json'), '{"a":1}');
  return await loadOrDefault(at('config.json'), '{}');
}, '{"a":1}', loadOrDefault);
checkAsync('missing', async () => await loadOrDefault(at('gone.json'), '{}'), '{}', loadOrDefault);
checkAsync('a directory is a different error', async () => {
  try { await loadOrDefault(TMP, 'fallback'); return 'no throw'; } catch (e) { return e.code; }
}, 'EISDIR', loadOrDefault);

section('Exercise 6 — folders');
/* makeFolder(p) creates it including any missing parents, and does not
 * fail when it already exists.
 * listNames(p) returns the sorted names inside a folder.         */
async function makeFolder(p) {
  // your code here
}
async function listNames(p) {
  // your code here
}
checkAsync('creates nested folders', async () => {
  await makeFolder(at('a/b/c'));
  return await exists(at('a/b/c'));
}, true, makeFolder);
checkAsync('running twice is fine', async () => {
  await makeFolder(at('a/b/c'));
  await makeFolder(at('a/b/c'));
  return 'no error';
}, 'no error', makeFolder);
checkAsync('lists', async () => {
  await makeFolder(at('list'));
  await save(at('list/b.txt'), '');
  await save(at('list/a.txt'), '');
  return await listNames(at('list'));
}, ['a.txt', 'b.txt'], listNames);

section('Exercise 7 — file or folder?');
/* kindOf(p) returns 'file', 'folder' or 'missing'.               */
async function kindOf(p) {
  // your code here
}
checkAsync('file', async () => {
  await save(at('k.txt'), 'x');
  return await kindOf(at('k.txt'));
}, 'file', kindOf);
checkAsync('folder', async () => await kindOf(TMP), 'folder', kindOf);
checkAsync('missing', async () => await kindOf(at('not-there')), 'missing', kindOf);

section('Exercise 8 — JSON on disk');
/* saveJson(p, value) writes pretty-printed JSON (2-space indent).
 * loadJson(p, fallback) reads and parses it, returning the fallback when
 * the file is missing OR the JSON is invalid.                    */
async function saveJson(p, value) {
  // your code here
}
async function loadJson(p, fallback) {
  // your code here
}
checkAsync('round trip', async () => {
  await saveJson(at('data.json'), { a: [1, 2], b: 'x' });
  return await loadJson(at('data.json'), null);
}, { a: [1, 2], b: 'x' }, saveJson);
checkAsync('pretty printed', async () => {
  await saveJson(at('pretty.json'), { a: 1 });
  return await load(at('pretty.json'));
}, '{\n  "a": 1\n}', saveJson);
checkAsync('missing file', async () => await loadJson(at('gone.json'), { d: true }), { d: true }, loadJson);
checkAsync('invalid json', async () => {
  await save(at('bad.json'), '{oops');
  return await loadJson(at('bad.json'), { d: true });
}, { d: true }, loadJson);

section('Exercise 9 — copying a folder');
/* copyTree(from, to) copies files and subfolders recursively. Write it
 * yourself with readdir + stat + recursion (fs.cp exists, but the
 * recursion is the exercise).                                    */
async function copyTree(from, to) {
  // your code here
}
checkAsync('copies nested content', async () => {
  await makeFolder(at('src/inner'));
  await save(at('src/top.txt'), 'top');
  await save(at('src/inner/deep.txt'), 'deep');
  await copyTree(at('src'), at('dest'));
  return [await load(at('dest/top.txt')), await load(at('dest/inner/deep.txt'))];
}, ['top', 'deep'], copyTree);

section('Exercise 10 — finding files by extension');
/* findByExtension(root, ext) returns every matching path, recursively,
 * sorted, RELATIVE to root.                                      */
async function findByExtension(root, ext) {
  // your code here
}
checkAsync('finds them', async () => {
  await makeFolder(at('proj/sub'));
  await save(at('proj/a.js'), '');
  await save(at('proj/b.txt'), '');
  await save(at('proj/sub/c.js'), '');
  return await findByExtension(at('proj'), '.js');
}, ['a.js', path.join('sub', 'c.js')], findByExtension);
checkAsync('none', async () => await findByExtension(at('proj'), '.rs'), [], findByExtension);

section('Exercise 11 — reading a file line by line');
/* readLines(p) returns the lines with no trailing empty entry.   */
async function readLines(p) {
  // your code here
}
checkAsync('splits', async () => {
  await save(at('lines.txt'), 'a\nb\nc\n');
  return await readLines(at('lines.txt'));
}, ['a', 'b', 'c'], readLines);
checkAsync('no trailing newline', async () => {
  await save(at('lines2.txt'), 'a\nb');
  return await readLines(at('lines2.txt'));
}, ['a', 'b'], readLines);
checkAsync('empty file', async () => {
  await save(at('empty.txt'), '');
  return await readLines(at('empty.txt'));
}, [], readLines);

section('PREDICTIONS');

// P1: what does readFile return with no encoding?
let p1 = null;
check('P1  readFile(p) with no encoding gives a', p1, 'Buffer');

// P2: does writeFile append or overwrite?
let p2 = null;
check('P2  writeFile on an existing file', p2, 'overwrites');

// P3: the error code for a missing file
let p3 = null;
checkAsync('P3  error.code when reading a missing file', async () => p3, await_code());
async function await_code() {
  try { await fs.readFile(at('definitely-missing')); return 'no error'; } catch (e) { return e.code; }
}

// P4: is there an fs.promises.exists?
let p4 = null;
check('P4  does fs/promises have an exists()?', p4, typeof fs.exists === 'function');

// P5: does mkdir recursive throw when the folder exists?
let p5 = null;
checkAsync('P5  mkdir recursive on an existing folder', async () => p5, await_mkdir());
async function await_mkdir() {
  try { await fs.mkdir(TMP, { recursive: true }); return 'no error'; } catch (e) { return e.code; }
}

log('the habit', 'try the operation and handle the error code — never check-then-act');

report();

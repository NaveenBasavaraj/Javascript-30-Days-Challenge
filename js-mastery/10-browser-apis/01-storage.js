'use strict';
const { check, section, log, report } = require('../_helpers/check');
const { createStorages } = require('../_helpers/browser-apis');

/* ============================================================================
 * BROWSER APIS 01 — STORAGE
 * Run with:  node 10-browser-apis/01-storage.js
 *
 * Node has no localStorage, so these exercises use a spec-accurate
 * implementation from ../_helpers/browser-apis.js. Everything else in this
 * topic (URL, Intl, Date, EventTarget) is REAL — Node has it built in.
 *
 * THE API — identical for localStorage and sessionStorage:
 *   setItem(key, value)   stores
 *   getItem(key)          the value, or null when missing
 *   removeItem(key)
 *   clear()
 *   key(i) / length       iterate
 *
 * THE THREE THINGS THAT CATCH PEOPLE
 *   1. EVERYTHING IS A STRING. setItem('n', 1) then getItem('n') gives
 *      the string '1'. An object becomes '[object Object]' — you must
 *      JSON.stringify it yourself.
 *   2. A MISSING KEY IS null, not undefined.
 *   3. IT IS SYNCHRONOUS and blocks the main thread. Fine for a few KB,
 *      terrible for megabytes. It also has a quota (about 5MB), and
 *      exceeding it THROWS.
 *
 * localStorage persists until cleared. sessionStorage dies with the tab.
 * Neither is secure: never put tokens or personal data in them.
 * ==========================================================================*/

section('Exercise 1 — set and get');
/* save(storage, key, value) and load(storage, key).              */
function save(storage, key, value) {
  // your code here
}
function load(storage, key) {
  // your code here
}
check('round trip', () => {
  const { localStorage } = createStorages();
  save(localStorage, 'name', 'Asha');
  return load(localStorage, 'name');
}, 'Asha', save);
check('missing is null', () => load(createStorages().localStorage, 'nope'), null, load);

section('Exercise 2 — everything is a string');
/* storeNumber(storage) stores the NUMBER 42 and returns
 * [typeof stored, stored].                                       */
function storeNumber(storage) {
  // your code here
}
check('coerced', () => storeNumber(createStorages().localStorage), ['string', '42'], storeNumber);

section('Exercise 3 — objects need JSON');
/* saveObject(storage, key, obj) and loadObject(storage, key, fallback)
 * handle the stringify/parse for you. A missing key OR invalid JSON
 * returns the fallback.                                          */
function saveObject(storage, key, obj) {
  // your code here
}
function loadObject(storage, key, fallback) {
  // your code here
}
check('round trip', () => {
  const { localStorage } = createStorages();
  saveObject(localStorage, 'user', { name: 'Asha', tags: ['a'] });
  return loadObject(localStorage, 'user', null);
}, { name: 'Asha', tags: ['a'] }, saveObject);
check('missing', () => loadObject(createStorages().localStorage, 'nope', { d: 1 }), { d: 1 }, loadObject);
check('corrupt data', () => {
  const { localStorage } = createStorages();
  localStorage.setItem('broken', '{oops');
  return loadObject(localStorage, 'broken', { d: 1 });
}, { d: 1 }, loadObject);
check('naive storage loses the object', () => {
  const { localStorage } = createStorages();
  localStorage.setItem('raw', { a: 1 });
  return localStorage.getItem('raw');
}, '[object Object]', saveObject);

section('Exercise 4 — removing and clearing');
/* forget(storage, key) removes one. wipe(storage) removes everything.
 * Both return the resulting length.                              */
function forget(storage, key) {
  // your code here
}
function wipe(storage) {
  // your code here
}
check('forget', () => {
  const { localStorage } = createStorages();
  localStorage.setItem('a', '1');
  localStorage.setItem('b', '2');
  return forget(localStorage, 'a');
}, 1, forget);
check('wipe', () => {
  const { localStorage } = createStorages();
  localStorage.setItem('a', '1');
  return wipe(localStorage);
}, 0, wipe);
check('forgetting a missing key is harmless', () => {
  const { localStorage } = createStorages();
  localStorage.setItem('a', '1');
  return forget(localStorage, 'nope');
}, 1, forget);

section('Exercise 5 — listing what is stored');
/* allKeys(storage) returns the keys, sorted.
 * allEntries(storage) returns an object of key -> value.         */
function allKeys(storage) {
  // your code here
}
function allEntries(storage) {
  // your code here
}
check('keys', () => {
  const { localStorage } = createStorages();
  localStorage.setItem('b', '2');
  localStorage.setItem('a', '1');
  return allKeys(localStorage);
}, ['a', 'b'], allKeys);
check('entries', () => {
  const { localStorage } = createStorages();
  localStorage.setItem('a', '1');
  return allEntries(localStorage);
}, { a: '1' }, allEntries);
check('empty', allEntries(createStorages().localStorage), {}, allEntries);

section('Exercise 6 — namespacing');
/* Several apps share one origin's storage, so prefix your keys.
 * makeNamespaced(storage, prefix) returns { set, get, remove, keys }
 * where keys() gives the names WITHOUT the prefix, and nothing touches
 * keys belonging to anyone else.                                 */
function makeNamespaced(storage, prefix) {
  // your code here
}
check('prefixes under the hood', () => {
  const { localStorage } = createStorages();
  const store = makeNamespaced(localStorage, 'app');
  store.set('theme', 'dark');
  return localStorage.getItem('app:theme');
}, 'dark', makeNamespaced);
check('reads back', () => {
  const { localStorage } = createStorages();
  const store = makeNamespaced(localStorage, 'app');
  store.set('theme', 'dark');
  return store.get('theme');
}, 'dark', makeNamespaced);
check('ignores other namespaces', () => {
  const { localStorage } = createStorages();
  localStorage.setItem('other:thing', 'x');
  const store = makeNamespaced(localStorage, 'app');
  store.set('theme', 'dark');
  return store.keys();
}, ['theme'], makeNamespaced);
check('remove only removes its own', () => {
  const { localStorage } = createStorages();
  localStorage.setItem('other:theme', 'keep me');
  const store = makeNamespaced(localStorage, 'app');
  store.set('theme', 'dark');
  store.remove('theme');
  return localStorage.getItem('other:theme');
}, 'keep me', makeNamespaced);

section('Exercise 7 — values with an expiry');
/* Storage has no TTL, so store one yourself.
 * setWithExpiry(storage, key, value, ttlMs, now)
 * getWithExpiry(storage, key, now) returns the value, or null once it
 * has expired (and removes it).                                  */
function setWithExpiry(storage, key, value, ttlMs, now) {
  // your code here
}
function getWithExpiry(storage, key, now) {
  // your code here
}
check('fresh', () => {
  const { localStorage } = createStorages();
  setWithExpiry(localStorage, 'token', 'abc', 1000, 0);
  return getWithExpiry(localStorage, 'token', 500);
}, 'abc', setWithExpiry);
check('expired', () => {
  const { localStorage } = createStorages();
  setWithExpiry(localStorage, 'token', 'abc', 1000, 0);
  return getWithExpiry(localStorage, 'token', 2000);
}, null, getWithExpiry);
check('expiry cleans up', () => {
  const { localStorage } = createStorages();
  setWithExpiry(localStorage, 'token', 'abc', 1000, 0);
  getWithExpiry(localStorage, 'token', 2000);
  return localStorage.length;
}, 0, getWithExpiry);
check('missing key', () => getWithExpiry(createStorages().localStorage, 'nope', 0), null, getWithExpiry);

section('Exercise 8 — handling the quota');
/* safeSet(storage, key, value) returns true when it stored the value and
 * false when the quota was exceeded — without crashing.          */
function safeSet(storage, key, value) {
  // your code here
}
check('fits', () => safeSet(createStorages({ quota: 100 }).localStorage, 'a', 'small'), true, safeSet);
check('too big', () => safeSet(createStorages({ quota: 5 }).localStorage, 'a', 'far too long'), false, safeSet);
check('the store is unchanged after a failure', () => {
  const { localStorage } = createStorages({ quota: 5 });
  safeSet(localStorage, 'a', 'far too long');
  return localStorage.length;
}, 0, safeSet);

section('Exercise 9 — a typed store');
/* makeTypedStore(storage) with get(key, fallback) and set(key, value)
 * that preserve TYPES through JSON: numbers, booleans, arrays, objects
 * and null all come back as they went in.                        */
function makeTypedStore(storage) {
  // your code here
}
check('number', () => {
  const s = makeTypedStore(createStorages().localStorage);
  s.set('n', 42);
  return s.get('n');
}, 42, makeTypedStore);
check('boolean', () => {
  const s = makeTypedStore(createStorages().localStorage);
  s.set('b', false);
  return s.get('b');
}, false, makeTypedStore);
check('array', () => {
  const s = makeTypedStore(createStorages().localStorage);
  s.set('a', [1, 'two']);
  return s.get('a');
}, [1, 'two'], makeTypedStore);
check('null is a real value', () => {
  const s = makeTypedStore(createStorages().localStorage);
  s.set('x', null);
  return s.get('x', 'fallback');
}, null, makeTypedStore);
check('missing uses the fallback', () => makeTypedStore(createStorages().localStorage).get('nope', 'fb'),
  'fb', makeTypedStore);

section('Exercise 10 — local versus session');
/* Show they are separate stores.
 * separateStores() writes 'a' to each with different values and returns
 * [localValue, sessionValue].                                    */
function separateStores() {
  // your code here
}
check('independent', separateStores(), ['local', 'session'], separateStores);

section('PREDICTIONS');

// P1: what type comes out of getItem?
const { localStorage: ls1 } = createStorages();
ls1.setItem('n', 42);
let p1 = null;
check('P1  typeof localStorage.getItem("n") after storing the number 42', p1, typeof ls1.getItem('n'));

// P2: a missing key
let p2 = null;
check('P2  String(localStorage.getItem("missing"))', p2, String(ls1.getItem('missing')));

// P3: storing an object without JSON
ls1.setItem('o', { a: 1 });
let p3 = null;
check('P3  localStorage.getItem("o") after storing an object', p3, ls1.getItem('o'));

// P4: is localStorage synchronous?
let p4 = null;
check('P4  does localStorage block the main thread?', p4, true);

// P5: which one survives a tab close?
let p5 = null;
check('P5  the storage that persists is', p5, 'localStorage');

// P6: is it safe for an auth token?
let p6 = null;
check('P6  should you store an auth token in localStorage?', p6, false);

log('the rule', 'JSON in, JSON out, namespaced keys, and never anything secret');

report();

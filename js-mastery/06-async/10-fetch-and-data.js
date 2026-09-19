'use strict';
const { check, checkAsync, sleep, section, log, report } = require('../_helpers/check');

/* ============================================================================
 * ASYNC 10 — FETCHING DATA
 *
 * This file uses a FAKE fetch (below) so it runs offline and gives the
 * same answer every time. The API is identical to the real one.
 *
 * THE TRAP THAT CATCHES EVERYONE:
 *   fetch does NOT reject on 404 or 500. A response IS a successful
 *   network round trip, whatever the status. Only a network failure
 *   rejects. So you must check `response.ok` yourself:
 *
 *     const res = await fetch(url);
 *     if (!res.ok) throw new Error(`HTTP ${res.status}`);
 *     const data = await res.json();
 *
 * TWO AWAITS, always: one for the response headers, one for the body.
 * The body is a stream, and it can only be read ONCE.
 *
 *   res.ok          true for status 200-299
 *   res.status      the number
 *   res.json()      parses the body — rejects on invalid JSON
 *   res.text()      the raw body
 *
 * POSTing:
 *   fetch(url, { method: 'POST',
 *                headers: { 'Content-Type': 'application/json' },
 *                body: JSON.stringify(data) })
 * ==========================================================================*/

/* ---- the fake server, provided ---------------------------------------- */
const ROUTES = {
  '/users': [{ id: 'u1', name: 'Asha' }, { id: 'u2', name: 'Ben' }],
  '/users/u1': { id: 'u1', name: 'Asha', teamId: 't1' },
  '/teams/t1': { id: 't1', name: 'Engineering' },
  '/slow': { ok: true },
  '/bad-json': '<<<not json>>>',
};
function fetch(url, options = {}) {
  return new Promise((resolve, reject) => {
    if (url === '/network-error') {
      setTimeout(() => reject(new TypeError('Failed to fetch')), 5);
      return;
    }
    const delay = url === '/slow' ? 60 : 5;
    setTimeout(() => {
      if (options.method === 'POST') {
        resolve(makeResponse(201, { created: true, sent: JSON.parse(options.body) }));
        return;
      }
      if (!(url in ROUTES)) {
        resolve(makeResponse(404, { error: 'not found' }));
        return;
      }
      resolve(makeResponse(200, ROUTES[url]));
    }, delay);
  });
}
function makeResponse(status, payload) {
  let used = false;
  const body = typeof payload === 'string' ? payload : JSON.stringify(payload);
  const readBody = () => {
    if (used) return Promise.reject(new TypeError('body already read'));
    used = true;
    return Promise.resolve(body);
  };
  return {
    status,
    ok: status >= 200 && status < 300,
    text: readBody,
    json: () => readBody().then((t) => JSON.parse(t)),
  };
}
/* ----------------------------------------------------------------------- */

section('Exercise 1 — the two awaits');
/* getUsers() fetches '/users' and returns the parsed array.      */
async function getUsers() {
  // your code here
}
checkAsync('parsed', async () => await getUsers(), [{ id: 'u1', name: 'Asha' }, { id: 'u2', name: 'Ben' }], getUsers);

section('Exercise 2 — a 404 does NOT reject');
/* showTheTrap() fetches '/nope' and returns [res.ok, res.status]
 * WITHOUT throwing, proving the request "succeeded".             */
async function showTheTrap() {
  // your code here
}
checkAsync('no rejection for a 404', async () => await showTheTrap(), [false, 404], showTheTrap);

section('Exercise 3 — check response.ok');
/* getJson(url) returns the parsed body, or throws
 * new Error(`HTTP ${status}`) for a non-ok response.             */
async function getJson(url) {
  // your code here
}
checkAsync('success', async () => await getJson('/teams/t1'), { id: 't1', name: 'Engineering' }, getJson);
checkAsync('404 throws', async () => {
  try { await getJson('/nope'); return 'no error'; } catch (e) { return e.message; }
}, 'HTTP 404', getJson);

section('Exercise 4 — a network failure DOES reject');
/* networkFailure() fetches '/network-error' in a try/catch and returns
 * the error message.                                             */
async function networkFailure() {
  // your code here
}
checkAsync('rejects', async () => await networkFailure(), 'Failed to fetch', networkFailure);

section('Exercise 5 — telling the two apart');
/* describeFailure(url) returns:
 *   'ok' when the request succeeds
 *   `http ${status}` for a bad status
 *   `network: ${message}` when fetch itself rejects                */
async function describeFailure(url) {
  // your code here
}
checkAsync('good', async () => await describeFailure('/users'), 'ok', describeFailure);
checkAsync('bad status', async () => await describeFailure('/nope'), 'http 404', describeFailure);
checkAsync('network', async () => await describeFailure('/network-error'), 'network: Failed to fetch', describeFailure);

section('Exercise 6 — the body can only be read once');
/* readTwice() fetches '/users', reads .json(), then tries .text() and
 * returns the second error's message.                            */
async function readTwice() {
  // your code here
}
checkAsync('second read fails', async () => await readTwice(), 'body already read', readTwice);

section('Exercise 7 — invalid JSON');
/* getBadJson() fetches '/bad-json', calls .json(), and returns
 * 'invalid json' when parsing throws.                            */
async function getBadJson() {
  // your code here
}
checkAsync('handled', async () => await getBadJson(), 'invalid json', getBadJson);

section('Exercise 8 — sequential vs parallel requests');
/* userAndTeamSlow() fetches the user, then the team — two round trips
 * one after the other.
 * usersAndTeamFast() fetches '/users' and '/teams/t1' AT THE SAME TIME
 * and returns [users.length, team.name].                         */
async function userAndTeamSlow() {
  // your code here: fetch /users/u1, then /teams/<their teamId>
}
async function usersAndTeamFast() {
  // your code here
}
checkAsync('dependent requests must be sequential', async () => await userAndTeamSlow(), 'Engineering', userAndTeamSlow);
checkAsync('independent ones should be parallel', async () => await usersAndTeamFast(), [2, 'Engineering'], usersAndTeamFast);
checkAsync('and it is quicker', async () => {
  const start = Date.now();
  await usersAndTeamFast();
  return Date.now() - start < 9;
}, true, usersAndTeamFast);

section('Exercise 9 — POST');
/* createUser(name) POSTs { name } as JSON to '/users' and returns the
 * parsed response body.                                          */
async function createUser(name) {
  // your code here
}
checkAsync('posts json', async () => await createUser('Cara'),
  { created: true, sent: { name: 'Cara' } }, createUser);

section('Exercise 10 — a small API client');
/* makeApi() returns an object with get(path) and post(path, body), both
 * returning parsed JSON and throwing `HTTP ${status}` on a bad status.
 * Share one private request function between them.               */
function makeApi() {
  // your code here
}
checkAsync('get', async () => await makeApi().get('/users/u1'),
  { id: 'u1', name: 'Asha', teamId: 't1' }, makeApi);
checkAsync('post', async () => await makeApi().post('/users', { name: 'Dev' }),
  { created: true, sent: { name: 'Dev' } }, makeApi);
checkAsync('get throws on 404', async () => {
  try { await makeApi().get('/nope'); return 'no error'; } catch (e) { return e.message; }
}, 'HTTP 404', makeApi);

section('Exercise 11 — fetch with a timeout');
/* fetchWithTimeout(url, ms) rejects with new Error('timeout') when the
 * request takes too long. '/slow' takes 60ms.                    */
async function fetchWithTimeout(url, ms) {
  // your code here
}
checkAsync('fast enough', async () => (await fetchWithTimeout('/users', 50)).ok, true, fetchWithTimeout);
checkAsync('too slow', async () => {
  try { await fetchWithTimeout('/slow', 20); return 'no error'; } catch (e) { return e.message; }
}, 'timeout', fetchWithTimeout);

section('Exercise 12 — fetch everything, keep what worked');
/* getAll(urls) fetches them all in parallel and returns
 *   { ok: [parsed bodies], failed: [urls that failed] }
 * A bad status counts as a failure.                              */
async function getAll(urls) {
  // your code here
}
checkAsync('mixed results', async () => await getAll(['/teams/t1', '/nope', '/users/u1']), {
  ok: [{ id: 't1', name: 'Engineering' }, { id: 'u1', name: 'Asha', teamId: 't1' }],
  failed: ['/nope'],
}, getAll);

section('PREDICTIONS');

// P1: does fetch reject on a 500?
let p1 = null;
check('P1  does fetch() reject for a 500 response?', p1, false);

// P2: how many awaits to get JSON out of fetch?
let p2 = null;
check('P2  awaits needed to read a JSON body', p2, 2);

// P3: what does res.json() return before awaiting?
let p3 = null;
checkAsync('P3  typeof res.json()', async () => p3, await_typeof());
async function await_typeof() { const r = await fetch('/users'); return typeof r.json(); }

// P4: what rejects a fetch?
let p4 = null;
check('P4  fetch rejects only on', p4, 'a network failure');

report();

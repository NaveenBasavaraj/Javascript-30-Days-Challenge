'use strict';
const { check, checkAsync, sleep, section, log, report } = require('../_helpers/check');
const { EventEmitter, once } = require('events');
const { Readable, Writable, Transform, pipeline } = require('stream');
const { pipeline: pipe } = require('stream/promises');

/* ============================================================================
 * MODULES 07 — EVENTS & STREAMS
 *
 * Two Node patterns that appear everywhere once you leave toy scripts.
 *
 * EVENTEMITTER — the observer pattern, built in.
 *   emitter.on(event, fn)       subscribe
 *   emitter.once(event, fn)     subscribe for one emission
 *   emitter.off(event, fn)      unsubscribe (same function reference!)
 *   emitter.emit(event, ...a)   -> true if anyone was listening
 *   emitter.listenerCount(e)
 *   await once(emitter, event)  a promise for the next emission
 *
 *   THE 'error' EVENT IS SPECIAL: emitting 'error' with NO listener
 *   throws and crashes the process. Always attach one.
 *
 * STREAMS — process data in pieces instead of loading it all.
 *   Readable   produces chunks            (a file being read)
 *   Writable   consumes chunks            (a file being written)
 *   Transform  reads, changes, writes     (gzip, a CSV parser)
 *   Duplex     both, independently        (a socket)
 *
 *   a.pipe(b) connects them. Prefer `pipeline` — it handles errors and
 *   cleanup, which pipe does not.
 *
 *   BACKPRESSURE is the point: if the writer is slower than the reader,
 *   the stream tells the reader to pause. That is what stops a 10GB file
 *   from filling your memory.
 * ==========================================================================*/

section('Exercise 1 — a basic emitter');
/* makeTicker() returns an EventEmitter. tick(n) emits 'tick' with n.
 * Return { emitter, tick }.                                      */
function makeTicker() {
  // your code here
}
check('emits', () => {
  const { emitter, tick } = makeTicker();
  const seen = [];
  emitter.on('tick', (n) => seen.push(n));
  tick(1); tick(2);
  return seen;
}, [1, 2], makeTicker);
check('it really is an EventEmitter', () => makeTicker().emitter instanceof EventEmitter, true, makeTicker);

section('Exercise 2 — once and off');
/* subscribeOnce(emitter, event) attaches a one-time listener and returns
 * an array that will hold the values it receives.
 * unsubscribe(emitter, event, fn) removes that exact listener.   */
function subscribeOnce(emitter, event) {
  // your code here
}
function unsubscribe(emitter, event, fn) {
  // your code here
}
check('only the first emission', () => {
  const e = new EventEmitter();
  const seen = subscribeOnce(e, 'ping');
  e.emit('ping', 1); e.emit('ping', 2);
  return seen;
}, [1], subscribeOnce);
check('off removes it', () => {
  const e = new EventEmitter();
  const seen = [];
  const fn = (v) => seen.push(v);
  e.on('x', fn);
  e.emit('x', 1);
  unsubscribe(e, 'x', fn);
  e.emit('x', 2);
  return seen;
}, [1], unsubscribe);

section('Exercise 3 — emit tells you if anyone listened');
/* hadListeners(emitter, event) emits and returns the boolean result.  */
function hadListeners(emitter, event) {
  // your code here
}
check('nobody listening', () => hadListeners(new EventEmitter(), 'x'), false, hadListeners);
check('someone listening', () => {
  const e = new EventEmitter();
  e.on('x', () => {});
  return hadListeners(e, 'x');
}, true, hadListeners);

section('Exercise 4 — the error event');
/* safeEmitError(emitter) emits 'error' inside a try/catch and returns
 * 'crashed' when it throws (no listener) or 'handled' when it does not. */
function safeEmitError(emitter) {
  // your code here
}
check('no listener crashes', safeEmitError(new EventEmitter()), 'crashed', safeEmitError);
check('a listener saves it', () => {
  const e = new EventEmitter();
  e.on('error', () => {});
  return safeEmitError(e);
}, 'handled', safeEmitError);

section('Exercise 5 — waiting for an event');
/* waitFor(emitter, event) resolves with the emitted value, using
 * `once` from node:events (already imported).                    */
async function waitFor(emitter, event) {
  // your code here
}
checkAsync('resolves on emit', async () => {
  const e = new EventEmitter();
  setTimeout(() => e.emit('ready', 'now'), 10);
  const args = await waitFor(e, 'ready');
  return args;
}, ['now'], waitFor);

section('Exercise 6 — an emitter-based queue');
/* makeJobQueue() extends EventEmitter behaviour:
 *   add(job)   emits 'added' with the job, returns the queue length
 *   process()  removes and emits 'done' with each job, in order,
 *              then emits 'empty'
 * Return an object { emitter, add, process }.                    */
function makeJobQueue() {
  // your code here
}
check('lifecycle', () => {
  const q = makeJobQueue();
  const events = [];
  q.emitter.on('added', (j) => events.push(`added ${j}`));
  q.emitter.on('done', (j) => events.push(`done ${j}`));
  q.emitter.on('empty', () => events.push('empty'));
  q.add('a'); q.add('b');
  q.process();
  return events;
}, ['added a', 'added b', 'done a', 'done b', 'empty'], makeJobQueue);
check('add returns the length', () => {
  const q = makeJobQueue();
  q.add('a');
  return q.add('b');
}, 2, makeJobQueue);

section('Exercise 7 — a readable stream');
/* fromArray(items) returns a Readable in object mode that emits each
 * item then ends. Hint: Readable.from does it in one line.       */
function fromArray(items) {
  // your code here
}
checkAsync('streams the items', async () => {
  const out = [];
  for await (const item of fromArray(['a', 'b', 'c'])) out.push(item);
  return out;
}, ['a', 'b', 'c'], fromArray);
checkAsync('empty', async () => {
  const out = [];
  for await (const item of fromArray([])) out.push(item);
  return out;
}, [], fromArray);

section('Exercise 8 — collecting a stream');
/* collect(readable) reads every chunk and returns them as an array.  */
async function collect(readable) {
  // your code here
}
checkAsync('collects', async () => await collect(Readable.from([1, 2, 3])), [1, 2, 3], collect);

section('Exercise 9 — a transform stream');
/* upperCase() returns a Transform in object mode that uppercases each
 * string chunk.                                                  */
function upperCase() {
  // your code here
}
checkAsync('transforms', async () => {
  const out = [];
  await pipe(Readable.from(['a', 'b']), upperCase(), new Writable({
    objectMode: true,
    write(chunk, enc, cb) { out.push(chunk); cb(); },
  }));
  return out;
}, ['A', 'B'], upperCase);

section('Exercise 10 — a filtering transform');
/* onlyLongerThan(n) drops chunks that are too short. In a Transform you
 * emit by calling this.push(value); not calling it drops the chunk.  */
function onlyLongerThan(n) {
  // your code here
}
checkAsync('filters', async () => {
  const out = [];
  await pipe(Readable.from(['a', 'abc', 'ab', 'abcd']), onlyLongerThan(2), new Writable({
    objectMode: true,
    write(chunk, enc, cb) { out.push(chunk); cb(); },
  }));
  return out;
}, ['abc', 'abcd'], onlyLongerThan);

section('Exercise 11 — a pipeline');
/* runPipeline(items) streams the items through upperCase() and
 * onlyLongerThan(2) and resolves with the collected results.     */
async function runPipeline(items) {
  // your code here
}
checkAsync('both transforms', async () => await runPipeline(['a', 'abc', 'abcd']), ['ABC', 'ABCD'], runPipeline);

section('Exercise 12 — memory, the whole point');
/* Streaming processes one chunk at a time. Prove it: countWhileStreaming
 * returns the MAXIMUM number of items held at once while summing a
 * stream of 1000 numbers. It must be 1, not 1000.                */
async function countWhileStreaming() {
  // your code here: for await over Readable.from of 1000 numbers, keeping
  // only a running total and a `held` counter that never exceeds 1
}
checkAsync('never holds more than one', async () => await countWhileStreaming(), 1, countWhileStreaming);

section('PREDICTIONS');

// P1: what does emit return with no listeners?
let p1 = null;
check('P1  new EventEmitter().emit("x")', p1, new EventEmitter().emit('x'));

// P2: does off work with a different but identical function?
const e2 = new EventEmitter();
e2.on('x', () => {});
e2.off('x', () => {});
let p2 = null;
check('P2  listenerCount after off with a new arrow', p2, e2.listenerCount('x'));

// P3: are listeners called synchronously?
const order3 = [];
const e3 = new EventEmitter();
e3.on('x', () => order3.push('listener'));
order3.push('before');
e3.emit('x');
order3.push('after');
let p3 = null;
check('P3  the order', p3, order3);

// P4: what happens on an unhandled 'error' event?
let p4 = null;
check('P4  emitting "error" with no listener', p4, 'throws');

// P5: does a stream load everything into memory?
let p5 = null;
check('P5  a stream holds, at a time', p5, 'one chunk');

log('the habit', 'events for "tell me when"; streams for "do not load it all"');

report();

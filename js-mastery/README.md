# JS Mastery — practice-first JavaScript

You learn by writing code, not by reading it. Every file here is a set of
exercises with the questions written as comments and a test that runs the
moment you save. Nothing is filled in for you.

## How to use it

1. Open the lowest-numbered file you have not finished, e.g.
   `01-arrays/01-creating-and-accessing.js`.
2. Read the NOTES block at the top once. It is short on purpose.
3. Work down the file. Each exercise gives you a stub like:

   ```js
   function firstAndLast(arr) {
     // your code here
   }
   ```

4. Run it:

   ```bash
   node 01-arrays/01-creating-and-accessing.js
   ```

   ```
   ✔ firstAndLast(3 items)
   ✘ firstAndLast(1 item)
       expected: [ 7, 7 ]
       actual:   [ 7, undefined ]
   ○ TODO secondToLast (not written yet)
   ```

5. Repeat until the file ends with **All done.** Then go to the next file.

### Watch mode (optional, re-runs on every save)

```bash
node --watch 01-arrays/01-creating-and-accessing.js
```

### See your overall progress

```bash
node progress.js            # every topic
node progress.js arrays     # one topic
```

## The three kinds of exercise

| Kind | What you do |
|---|---|
| **Write a function** | Fill in the stub so all its checks pass. |
| **PREDICTION** | Replace `null` with what you *think* JavaScript returns, then run it. A failing prediction prints the real answer — that failure is the lesson. Predictions start out failing by design. |
| **Challenge files** | No new syntax. Everything combined, interview-style. |

Order matters. The exercises assume the file before them.

## Rules that will make this work

- **Do not look up the answer before you have written something wrong.** A
  failing check is not a setback, it is the feedback loop.
- **Get it passing first, then make it shorter.** Once the checks are green,
  ask yourself whether `reduce`, `flatMap` or destructuring would say it better.
- **Never edit a `check(...)` line** to make it pass. If you think a check is
  wrong, say so — sometimes it will be.
- **Stuck for more than ~10 minutes?** Ask me. Say *"hint for arrays 06 ex 5"*
  and you get a nudge, not the answer. Say *"solution"* if you want the whole
  thing, and I will explain why it works. Paste your code and say
  *"review this"* and I will tell you what an experienced dev would change.

## Roadmap

| # | Topic | Status |
|---|---|---|
| 01 | **Arrays** — creation, mutation, iteration, search, map/filter/reduce, sorting, nesting, spread, copies, sets, modern methods, 40 challenges | **ready — 383 checks** |
| 02 | Strings & regex | unlocked when 01 is done |
| 03 | Objects, Maps & JSON | |
| 04 | Functions, scope & closures | |
| 05 | `this`, classes & prototypes | |
| 06 | Async: callbacks → promises → async/await | |
| 07 | Errors & debugging | |
| 08 | Modules, tooling & Node basics | |
| 09 | The DOM & events | |
| 10 | Capstone project | |

Topics unlock one at a time and on purpose: a half-finished array file is
worth more than three topics skimmed.

## Inside topic 01 — Arrays

| File | Covers |
|---|---|
| `01-creating-and-accessing` | literals, `Array.from`, `length`, `at()`, holes |
| `02-adding-and-removing` | push/pop/shift/unshift, `splice` vs `slice` |
| `03-looping` | `for`, `for...of`, `forEach`, `entries()`, early exit |
| `04-searching` | `includes`, `indexOf`, `find`, `some`, `every`, `filter` |
| `05-map-and-filter` | the two workhorses, chaining, the `map(parseInt)` trap |
| `06-reduce` | any shape of accumulator; rebuild `map`/`filter`/`join` |
| `07-sorting` | comparators, stability, multi-key, `toSorted` |
| `08-nested-and-flat` | `flat`, `flatMap`, matrices, transpose, the `fill` trap |
| `09-destructuring-and-spread` | patterns, defaults, rest, spread |
| `10-copies-and-mutation` | references, shallow vs deep, immutable updates |
| `11-sets-maps-and-conversions` | dedupe, set ops, `Object.entries`, array-likes |
| `12-modern-methods` | `at`, `findLast`, the non-mutating twins, `groupBy` |
| `13-15 challenges` | easy → medium → a real order dataset |

Start here:

```bash
node 01-arrays/01-creating-and-accessing.js
```

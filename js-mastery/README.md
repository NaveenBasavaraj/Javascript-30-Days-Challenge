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
| 02 | **Objects, Maps & JSON** — access, destructuring, spread vs deep copy, arrays of objects, Map/Set, JSON traps, immutable state, 40 challenges | **ready — 359 checks** |
| 03 | **Functions, Scope & Closures** — hoisting, scope, TDZ, closures, HOFs, currying, `this`/bind, recursion, debounce/throttle, 40 challenges | **ready — 389 checks** |
| 04 | **Strings & Regex** — reading, slicing, templates & tagged templates, unicode, then regex from `test` to lookahead, 60 challenges | **ready — 463 checks** |
| 05 | **Classes & Prototypes** — factories, `new`, the prototype chain, class syntax, private fields, inheritance, polymorphism, protocols, mixins, custom errors, 50 challenges | **ready — 495 checks** |
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

## Inside topic 02 — Objects, Maps & JSON

| File | Covers |
|---|---|
| `01-creating-and-accessing` | dot vs bracket, computed keys, `in`, nested reads |
| `02-updating-and-deleting` | `delete`, `?.`, `??`, `??=`, safe nested access |
| `03-iterating` | `keys`/`values`/`entries`/`fromEntries`, `mapValues`, key order |
| `04-destructuring` | renaming, defaults, nested, rest, parameter objects |
| `05-spread-and-merging` | shallow copy, merge precedence, `deepMerge` |
| `06-arrays-of-objects` | find, index, group, aggregate, normalize |
| `07-maps-and-sets` | Map vs object, object keys, memoize, set ops |
| `08-json` | replacer/reviver, and everything JSON silently destroys |
| `09-immutable-updates` | the React/Redux update pattern, `setIn`, a reducer |
| `10-methods-getters-descriptors` | `this` in methods, getters/setters, freeze, `defineProperty` |
| `11-equality-and-cloning` | write your own `deepEqual`, `diff`, `structuredClone` |
| `12-13 challenges` | validation, camel-casing, an API payload → a view model |

## Inside topic 03 — Functions, Scope & Closures

| File | Covers |
|---|---|
| `01-declaring-functions` | declarations vs expressions vs arrows, hoisting, IIFE |
| `02-parameters-and-arguments` | defaults, rest, `arguments`, object parameters, mutation |
| `03-return-values` | guard clauses, tuples vs records, pure vs impure |
| `04-scope` | block/function/global, `var` leaks, TDZ, shadowing |
| `05-closures` | counters, private state, factories, memoize, the module pattern |
| `06-closures-in-loops` | the `var`-in-a-loop bug and four ways to fix it (async) |
| `07-higher-order-functions` | write your own map/filter/reduce, predicates, wrappers |
| `08-composition-and-currying` | pipe, compose, partial, curry, tap, unary, flip |
| `09-this-and-binding` | the dot rule, detachment, call/apply/bind, arrows as methods |
| `10-recursion` | trees, flatten, mutual recursion, binary search, the stack limit |
| `11-practical-utilities` | once, memoize, retry, **debounce vs throttle** (async) |
| `12-13 challenges` | Redux, an event emitter, middleware, an LRU cache, a trampoline |

## Inside topic 04 — Strings & Regex

| File | Covers |
|---|---|
| `01-creating-and-reading` | quotes, escapes, immutability, `at()`, comparison |
| `02-searching` | includes/indexOf, the `-1` trap, counting, highlighting |
| `03-extracting` | slice vs substring, split with limits, parsing names and paths |
| `04-transforming` | case, trim, pad, repeat, slug, mask, camel/snake |
| `05-templates-and-building` | interpolation, joining lists, **tagged templates**, dedent |
| `06-unicode-and-code-points` | why `'👍'.length` is 2, surrogate pairs, normalize, graphemes |
| `07-regex-basics` | literals vs constructor, flags, `test`, escaping, the `lastIndex` trap |
| `08-regex-classes-and-quantifiers` | `\d\w\s`, ranges, greedy vs lazy, anchors, `\b` |
| `09-regex-groups` | capture, named, non-capturing, backreferences, lookaround |
| `10-regex-replace-and-match` | `$1`/`$&`, replacer functions, `matchAll`, `exec` loops |
| `11-12 challenges` | an .env parser, CSV with quoted fields, markdown, a tokeniser |

## Inside topic 05 — Classes & Prototypes

| File | Covers |
|---|---|
| `01-factory-functions` | building objects without `class`, and the cost of doing so |
| `02-constructor-functions` | what `new` actually does, `new.target`, forgetting `new` |
| `03-prototypes` | the chain, `Object.create`, shadowing, own vs inherited |
| `04-class-basics` | class syntax, instance fields, where methods really live |
| `05-getters-setters-and-statics` | derived values, validation, static factories and state |
| `06-private-fields` | `#private`, WeakMaps, the underscore lie, unforgeable brands |
| `07-inheritance` | `extends`, `super`, abstract bases, extending built-ins |
| `08-polymorphism` | duck typing vs `instanceof`, dispatch tables, `Symbol.hasInstance` |
| `09-built-in-protocols` | `toString`, `valueOf`, `toJSON`, iterators, generators |
| `10-mixins-and-composition` | object and class mixins, and why composition usually wins |
| `11-custom-errors` | error subclasses, `cause`, error families, a Result type |
| `12-13 challenges` | implement `new` and `instanceof`, a Store, an LRU, a validator DSL |

Start here:

```bash
node 01-arrays/01-creating-and-accessing.js
```

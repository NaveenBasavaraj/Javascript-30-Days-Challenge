/*
Day 2 : Counter

Given an integer n, return a counter function. 
This counter function initially returns n and then returns 1 more than the previous 
value every subsequent time it is called (n, n + 1, n + 2, etc).

Example 1:

Input: 
n = 10 
["call","call","call"]
Output: [10,11,12]
Explanation: 
counter() = 10 // The first time counter() is called, it returns n.
counter() = 11 // Returns 1 more than the previous time.
counter() = 12 // Returns 1 more than the previous time.

Example 2:

Input: 
n = -2
["call","call","call","call","call"]
Output: [-2,-1,0,1,2]
Explanation: counter() initially returns -2. Then increases after each sebsequent call.
 
Constraints:
-1000 <= n <= 1000
0 <= calls.length <= 1000
calls[i] === "call"
*/

var createCounter = function(n) {
    let count = n;
    return function() {
        return count++;
    };
};

const counter = createCounter(10)
console.log(counter()) // 10
console.log(counter()) // 11
console.log(counter()) // 12

/* ------------------------------------------------------------
   ⚠️ FIRST — A BUG IN THE ORIGINAL SOLUTION
   ------------------------------------------------------------
   Your original code:
 
     var createCounter = function(n) {
         count = n              // <-- no let/var/const!
         return function() {
             return count++;
         };
     };
 
   "count = n" WITHOUT a declaration keyword does NOT create a
   local variable. In non-strict mode, JS silently creates an
   IMPLICIT GLOBAL variable called "count" attached to the
   global object (window in browsers, globalThis in Node).
 
   Why this is dangerous:
     - If you call createCounter() TWICE, both counters would
       secretly share the SAME global "count" variable and
       stomp on each other's state.
     - In strict mode ("use strict" or inside an ES module),
       this throws: ReferenceError: count is not defined.
 
   Try this to see the bug:
 
     var createCounter = function(n) {
         count = n;
         return function() { return count++; };
     };
     const a = createCounter(10);
     const b = createCounter(100);
     console.log(a()); // 10
     console.log(b()); // 100
     console.log(a()); // 101 !! NOT 11 — "a" and "b" share one global "count"
 
   FIX: always declare local state explicitly.
------------------------------------------------------------- */

/* --------------------------------------------------------
    CONCEPT 1: Closures — this time it actually MATTERS
    --------------------------------------------------------
    In Day 1, the inner function didn't need to remember
    anything. Here, it does: every call must remember the
    CURRENT count between invocations.

    "let count = n;" creates a variable that lives inside
    createCounter's scope. The inner function forms a
    CLOSURE over it — meaning it keeps a live reference to
    "count," not a snapshot. Each call to counter() can read
    AND mutate that same variable, and the value persists
    across calls because the closure keeps it alive in
    memory even after createCounter() has returned.

    This is the textbook definition of closure-based STATE:
    private data that only the returned function can touch.
---------------------------------------------------------- */

/* --------------------------------------------------------
    CONCEPT 2: Post-increment (count++) vs Pre-increment (++count)
    --------------------------------------------------------
    count++  -> returns the CURRENT value, THEN increments.
    ++count  -> increments FIRST, THEN returns the new value.

    We need count++ here because the problem wants the
    FIRST call to return n itself, not n + 1.

    let count = 10;
    console.log(count++); // 10 (returns old value)
    console.log(count);   // 11 (already incremented)

    let count2 = 10;
    console.log(++count2); // 11 (increments first)
---------------------------------------------------------- */

// ---- Proof that closures are now properly isolated ----
const counterA = createCounter(10);
const counterB = createCounter(100);
console.log(counterA()); // 10
console.log(counterB()); // 100
console.log(counterA()); // 11  -- unaffected by counterB, because
                          //     each createCounter() call creates
                          //     its OWN "count" variable and its
                          //     OWN closure over it.

/* ============================================================
   ALTERNATE IMPLEMENTATIONS
   ============================================================ */

// --- Version A: Arrow function, same closure mechanics ---

const createCounterA = (n) => {
    let count = n;
    return () => count++;
};

// --- Version B: Explicit, no increment operator (most readable) ---
// Useful if an interviewer asks you to avoid "clever" operators.

const createCounterB = function(n) {
    let count = n;
    return function() {
        const current = count;
        count = count + 1;
        return current;
    };
};

// --- Version C: State stored on an object instead of a closure var ---
// Shows the same idea using a mutable object property. Less idiomatic
// for this problem, but useful if you later need to expose multiple
// methods (e.g. counter.reset()) sharing the same state.
const createCounterC = function(n) {
    const state = { count: n };
    return function() {
        return state.count++;
    };
};
 
console.log(createCounterA(-2)()); // -2
console.log(createCounterB(-2)()); // -2
console.log(createCounterC(-2)()); // -2

 
/* --------------------------------------------------------
   CONCEPT 3: Each call to createCounter() = a fresh closure
   --------------------------------------------------------
   It's worth internalizing: closures are created PER CALL,
   not per function definition. Every time createCounter(n)
   runs, a brand-new "count" variable and a brand-new inner
   function are created. They are NOT shared between different
   counters — that's exactly what the counterA/counterB proof
   above demonstrates, and exactly what the buggy global
   version violated.
---------------------------------------------------------- */
 
 
/* ============================================================
   🗣️ INTERVIEW FRAMING — How to explain this solution out loud
   ============================================================
 
   "createCounter uses a closure to hold private mutable state.
   The 'count' variable lives in createCounter's scope, and the
   returned function forms a closure over it — so each call can
   read and update the same variable across multiple
   invocations, without exposing 'count' to the outside world.
   I used count++ specifically because the spec wants the first
   call to return n itself before any increment happens. Also
   worth mentioning: if you forget to declare the variable with
   let/var/const, JS creates an implicit global in non-strict
   mode, which breaks isolation between separate counters — a
   good example of why closures rely on properly scoped
   variables to work correctly."
 
   TEACH-BACK CHECKLIST:
     [ ] Why does the returned function "remember" count?
     [ ] What happens if you forget "let" before count = n?
     [ ] Difference between count++ and ++count, and why it
         matters for this problem?
     [ ] Are counterA and counterB's "count" variables shared
         or independent? Why?
   ============================================================ */
/* ============================================================
   DAY 4 — Counter II
   ============================================================
 
   PROBLEM:
   Write a function createCounter. It should accept an initial
   integer init. It should return an object with three functions:
 
     increment() -> increases the current value by 1, then returns it
     decrement() -> decreases the current value by 1, then returns it
     reset()     -> resets the current value to init, then returns it
 
   Example 1:
     init = 5, calls = ["increment","reset","decrement"]
     Output: [6, 5, 4]
     const counter = createCounter(5);
     counter.increment(); // 6
     counter.reset();     // 5
     counter.decrement(); // 4
 
   Example 2:
     init = 0, calls = ["increment","increment","decrement","reset","reset"]
     Output: [1, 2, 1, 0, 0]
 
   Constraints:
     -1000 <= init <= 1000
     0 <= calls.length <= 1000
============================================================ */

var createCounter = function(init) {
    let count = init;
    return {
        increment: function() {
            return ++count;
        },
        decrement: function() {
            return --count;
        },
        reset: function() {
            return count = init;
        }
    }
}

/* --------------------------------------------------------
    CONCEPT 1: TWO pieces of closure state, not one
    --------------------------------------------------------
    Day 2's counter only needed to remember the CURRENT
    value. This problem needs to remember TWO things:

        1. "count"     -> the current, changing value
        2. "init"      -> the ORIGINAL value, so reset() can
                        go back to it

    Notice "init" is already the function's parameter — we
    don't need a second variable for it, we just never
    mutate it directly. "count" is a separate variable that
    starts equal to init but changes independently.

    If we only kept one variable and mutated it directly,
    we'd lose the original value and reset() would have
    nothing to reset TO.
---------------------------------------------------------- */

/* ------------------------------------------------------
    CONCEPT 2: Pre-increment / pre-decrement (++count)
    ------------------------------------------------------
    Unlike Day 2 (which needed to return the OLD value
    first via count++), this problem wants the NEW value
    returned immediately after changing it. That's exactly
    what the PRE operators do:

        ++count  -> increments FIRST, returns NEW value
        --count  -> decrements FIRST, returns NEW value

    Example:
        let x = 5;
        console.log(++x); // 6 (incremented, then returned)
        console.log(x);   // 6 (already updated)
--------------------------------------------------------- */

/* ------------------------------------------------------
    CONCEPT 3: Assignment expressions have a VALUE
    ------------------------------------------------------
    "count = init" is not just a statement — like all
    assignments in JS, it's an EXPRESSION that evaluates
    to the assigned value. That means we can assign AND
    return in one line:

        return count = init;

    This first sets count back to init, then the whole
    expression evaluates to init, which gets returned.
    Equivalent to the more explicit two-line version:

        count = init;
        return count;

    Both are correct — the one-liner is a common idiom
    you'll see in real codebases and other people's
    solutions, so it's worth recognizing even if you
    prefer the explicit version yourself.
--------------------------------------------------------- */

// ---- Running Example 1 ----
const counter = createCounter(5);
console.log(counter.increment()); // 6
console.log(counter.reset());     // 5
console.log(counter.decrement()); // 4
 
// ---- Running Example 2 ----
const counter2 = createCounter(0);
console.log(counter2.increment()); // 1
console.log(counter2.increment()); // 2
console.log(counter2.decrement()); // 1
console.log(counter2.reset());     // 0
console.log(counter2.reset());     // 0

/* ============================================================
   ALTERNATE IMPLEMENTATIONS
   ============================================================ */
 
// --- Version A: Explicit reset (no assignment-expression trick) ---
// Easier to read for beginners — does the same thing as reset()
// above, just spelled out across two lines.

const createCounterA = function(init) {
    let count = init;
    return {
        increment: function() { return ++count; },
        decrement: function() { return --count; },
        reset: function() {
            count = init;
            return count;
        }
    };
};

// --- Version B: Object method shorthand + arrow functions ---
// ES6 lets you drop "function" entirely inside object literals.
// NOTE: this shorthand form still creates a REGULAR function
// (has its own "this"), unlike the arrow functions used for
// increment/decrement below (which have no "this" of their own —
// fine here since we never use "this", only closed-over "count").

const createCounterB = (init) => {
    let count = init;
    return {
        increment: () => ++count,
        decrement: () => --count,
        reset: () => (count = init) // parens needed for clarity
        // with implicit-return arrows
    };
};

console.log(createCounterA(10).increment()); // 11
console.log(createCounterB(10).increment()); // 11

/* --------------------------------------------------------
   CONCEPT 4: Why this is still "just" closures
   --------------------------------------------------------
   Even though we now have three methods instead of one
   returned function, the mechanism is identical to Day 2:
   ALL THREE methods close over the SAME "count" variable
   from the SAME createCounter() call. Calling increment()
   changes "count," and decrement()/reset() immediately see
   that updated value — because they're not separate copies,
   they're three different doors into the same room.
---------------------------------------------------------- */


/* ============================================================
   🗣️ INTERVIEW FRAMING — How to explain this solution out loud
   ============================================================
 
   "createCounter keeps two pieces of closure state: 'count',
   the current mutable value, and 'init', the original value
   preserved so reset() has something to return to. All three
   returned methods — increment, decrement, reset — close over
   the same 'count' variable, so a change made by one is
   immediately visible to the others, since they're not
   independent copies. I used pre-increment/decrement (++count,
   --count) because the spec wants the NEW value returned
   immediately, unlike Day 2's counter which needed the OLD
   value returned first."
 
   TEACH-BACK CHECKLIST:
     [ ] Why do we need TWO variables (count and init) here,
         but only ONE in Day 2?
     [ ] ++count vs count++ — which one fits this problem and why?
     [ ] Why can "return count = init;" work as a single line?
     [ ] Why do increment/decrement/reset all see each other's
         changes to "count"?
   ============================================================ */
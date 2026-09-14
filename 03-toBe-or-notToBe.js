/*
Day 3 : To Be Or Not To Be

Write a function expect that helps developers test their code. It should take in any value val and return an object with the following two functions.

toBe(val) accepts another value and returns true if the two values === each other. If they are not equal, it should throw an error "Not Equal".
notToBe(val) accepts another value and returns true if the two values !== each other. If they are equal, it should throw an error "Equal".
 
Example 1:

Input: func = () => expect(5).toBe(5)
Output: {"value": true}
Explanation: 5 === 5 so this expression returns true.

Example 2:

Input: func = () => expect(5).toBe(null)
Output: {"error": "Not Equal"}
Explanation: 5 !== null so this expression throw the error "Not Equal".

Example 3:

Input: func = () => expect(5).notToBe(null)
Output: {"value": true}
Explanation: 5 !== null so this expression returns true.

*/

var expect = function(val) {
    return {
        toBe: function(val2) {
            if (val === val2) {
                return true;
            }
            throw new Error("Not Equal");
        },
        notToBe: function(val2){
            if (val !== val2) {
                return true;
            }
            throw new Error("Equal");
        }
    };
};


console.log(expect(5).toBe(5)); // true

// Use exception block to run this
// console.log(expect(5).notToBe(5)); // throws "Equal"

/* --------------------------------------------------------
    CONCEPT 1: Returning an OBJECT of functions (a small API)
    --------------------------------------------------------
    Unlike Day 1 & Day 2 (which returned a single function),
    here expect() returns an OBJECT that exposes multiple
    methods. This is the exact shape real testing libraries
    use: expect(x).toBe(y), expect(x).toEqual(y), etc.

    Both toBe and notToBe are closures over "val" — the
    value originally passed into expect(). Neither method
    receives "val" again; they only receive the value to
    COMPARE against.
---------------------------------------------------------- */

 /* ----------------------------------------------------
    CONCEPT 2: Strict equality (===) vs loose equality (==)
    ----------------------------------------------------
    === compares value AND type — no implicit conversion.
    == performs type coercion before comparing, which
    causes surprising results:

        5 === "5"   // false (different types)
        5 == "5"    // true  (string coerced to number)
        null === undefined // false
        null == undefined  // true

    The problem explicitly says "returns true if the two
    values === each other" — so we must use strict
    equality, matching how real assertion libraries work
    (you want exact matches, not coerced ones).
------------------------------------------------------- */

/* --------------------------------------------------------
CONCEPT 3: throw new Error(...) vs throw "string"
--------------------------------------------------------
You CAN throw a plain string:
    throw "Not Equal";
...and LeetCode's judge for this problem actually checks the
error MESSAGE as a string, so either works for grading.

But throwing a real Error object is the professional habit:
    - It captures a STACK TRACE (where the error happened).
    - It has a standard shape: error.message, error.name, etc.
    - Tools (debuggers, loggers, try/catch chains) expect
    Error instances, not arbitrary values.

Compare:
    try {
        throw "Not Equal";
    } catch (e) {
        console.log(e);          // "Not Equal" (just a string)
    }

    try {
        throw new Error("Not Equal");
    } catch (e) {
        console.log(e.message);  // "Not Equal"
        console.log(e.stack);    // full stack trace
    }
---------------------------------------------------------- */

try {
    expect(5).toBe(null);
} catch(e) {
    console.log(e.message);
}

try {
    expect(5).notToBe(5);
} catch(e) {
    console.log(e.message);
}

/* ============================================================
   ALTERNATE IMPLEMENTATIONS
   ============================================================ */
 
// --- Version A: Arrow functions inside the returned object ---
// Note: arrow functions don't bind their own "this", which is
// fine here since neither method uses "this" — they close over
// "val" directly instead.

const expectA = (val) => ({
    toBe: (val2) => {
        if (val === val2) return true;
        throw new Error("Not Equal");
    },
    notToBe: (val2) => {
        if (val !== val2) return true;
        throw new Error("Equal");
    }
});

// --- Version B: toBe implemented in terms of notToBe (DRY) ---
// Shows how one method can delegate to the other to avoid
// repeating comparison logic — a common refactor once your
// matcher object grows more methods (toBeGreaterThan, etc).

const expectB = function(val) {
    const self = {
        toBe: function(val2) {
            if (val !== val2) throw new Error("Not Equal");
            return true;
        },
        notToBe: function(val2) {
            try {
                self.toBe(val2);
            } catch (e) {
                return true;
            }
            throw new Error("Equal");
        }
    };
    return self;
};

console.log(expectA(5).toBe(5));       // true
console.log(expectB(5).notToBe(10));   // true
 
 
/* ============================================================
   🗣️ INTERVIEW FRAMING — How to explain this solution out loud
   ============================================================
 
"expect(val) returns an object exposing toBe and notToBe,
both closures over the original val. This mirrors how real
assertion libraries like Jest are structured — expect()
doesn't do the comparison itself, it returns a small API
that does. I used strict equality (===) because the spec
explicitly requires exact value-and-type matches, not
coerced equality. For failures I throw an Error object
rather than a bare string, since Error instances carry a
message and stack trace, which is the convention any
try/catch consumer will expect."

TEACH-BACK CHECKLIST:
    [ ] Why return an OBJECT here instead of a function?
    [ ] === vs == — give an example where they differ.
    [ ] Why throw new Error(...) instead of throw "string"?
    [ ] How do toBe/notToBe both "remember" val without it
        being passed to them again?
============================================================ */
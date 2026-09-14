/*
Day 1 - Question 1: Create Hello World Function

Write a function createHelloWorld. It should return a new function that always returns "Hello World".

Example 1:

Input: args = []
Output: "Hello World"
Explanation:
const f = createHelloWorld();
f(); // "Hello World"

The function returned by createHelloWorld should always return "Hello World".
Example 2:

Input: args = [{},null,42]
Output: "Hello World"
Explanation:
const f = createHelloWorld();
f({}, null, 42); // "Hello World"

Any arguments could be passed to the function but it should still always return "Hello World".

Constraints:

0 <= args.length <= 10
*/

var createHelloWorld = function() {
    
    return function(...args) {
        return "Hello World";
    }
};

const f = createHelloWorld();
console.log(f());            // "Hello World"
console.log(f({}, null, 42)); // "Hello World" (extra args ignored)

/* ------------------------------------------------------------
   CONCEPT 1: Function Declaration vs Function Expression
   ------------------------------------------------------------
   Declaration -> function createHelloWorld() {}
     - Fully HOISTED. Can be called before it's defined in code.
 
   Expression  -> var createHelloWorld = function() {}
     - Only the VARIABLE is hoisted (as undefined, if var).
     - The function itself isn't usable until this line runs.
     - Treated as a VALUE — can be passed, returned, stored.
 
   We use an expression here because we're treating the function
   as data: it gets assigned to a variable and eventually returns
   another function as its value.
------------------------------------------------------------- */

/* --------------------------------------------------------
    CONCEPT 2: First-Class Functions & Higher-Order Functions
    --------------------------------------------------------
    In JS, functions are "first-class citizens" — they can be:
        1. Assigned to variables
        2. Passed as arguments
        3. RETURNED from other functions   <-- this is our case

    A function that returns another function (or accepts one)
    is called a HIGHER-ORDER FUNCTION.
    createHelloWorld is higher-order because it returns a
    brand new function every time it's called.
---------------------------------------------------------- */
 
/* --------------------------------------------------------
    CONCEPT 3: Closures
    --------------------------------------------------------
    The inner function below doesn't use any variable from
    createHelloWorld's scope — but if it DID (e.g. a message
    variable defined above), it would still remember that
    variable even after createHelloWorld() has finished
    running. That "remembering" is a CLOSURE.

    Example to build intuition (not part of the LeetCode
    answer, just to see closures in action):

    var createGreeter = function(name) {
        return function() {
            return "Hello " + name;   // "name" is closed over
        };
    };
    const greetNaveen = createGreeter("Naveen");
    greetNaveen(); // "Hello Naveen" — remembers "name" forever
---------------------------------------------------------- */

/* --------------------------------------------------------
    CONCEPT 4: Rest Parameters (...args)
    --------------------------------------------------------
    "...args" collects ANY number of arguments passed into
    the function into a real Array.

        f();            // args = []
        f({}, null, 42) // args = [{}, null, 42]

    This satisfies the problem's rule: "any arguments could
    be passed... but it should still always return
    'Hello World'." We accept them, but never use them.

    NOTE: Rest params must be the LAST parameter, and there
    can only be one.
    
        function ok(a, b, ...rest) {}   // valid
        function bad(...rest, a) {}     // ❌ SyntaxError
---------------------------------------------------------- */

/* ============================================================
   ALTERNATE IMPLEMENTATIONS (same behavior, different syntax)
   ============================================================ */

// --- Version A: Arrow function outer, regular function inner ---

const createHelloWorldA = () => {
    return function(...args){
        return "Hello World";
    };
};

// --- Version B: Arrow function all the way (concise, implicit return) ---
// Note the double arrow: outer arrow RETURNS an inner arrow.

const createHelloWorldB = () => (...args) => "Hello World";

console.log(createHelloWorldA()());       // "Hello World"
console.log(createHelloWorldB()(1, 2, 3)); // "Hello World"

/* --------------------------------------------------------
   CONCEPT 5: Arrow Functions vs Regular Functions — the catch
   --------------------------------------------------------
   For THIS problem, arrow vs regular makes no functional
   difference because we never use "this" or "arguments".
 
   But know the difference for interviews:
     - Regular functions have their OWN "this" (depends on how
       they're called) and their OWN "arguments" object.
     - Arrow functions have NO "this" and NO "arguments" of
       their own — they inherit "this" from the enclosing scope
       lexically, and cannot use the "arguments" keyword at all
       (you must use rest params "...args" instead, like we did).
 
   This is exactly why "...args" is the safe, modern choice —
   it works identically whether the function is arrow or regular.
---------------------------------------------------------- */

/* ============================================================
   🗣️ INTERVIEW FRAMING — How to explain this solution out loud
   ============================================================
 
   "createHelloWorld is a higher-order function — it returns a
   new function instead of a value. I used rest parameters
   (...args) on the inner function so it can accept any number
   of arguments without caring what they are, satisfying the
   constraint that arguments can be passed but never change the
   output. Since the inner function doesn't reference any outer
   variable, there's no meaningful closure state here — but if
   I wanted every returned function to greet a *specific* name,
   I'd rely on closures to remember that name across calls."
 
   TEACH-BACK CHECKLIST (explain each without looking):
     [ ] Function declaration vs expression — which hoists fully?
     [ ] What makes a function "higher-order"?
     [ ] What does a closure "remember", and why?
     [ ] What does "...args" do, and where must it appear?
     [ ] Why can't arrow functions use "arguments"?
   ============================================================ */
# Problem 2 — Static Airport Board

**Phase 1: JSX & Rendering** · Problem 2 of 50
**New concepts:** arrays of objects · `.map()` · rendering lists · the `key` prop

---

## 1. The Problem

Build a departures board for an airport.

You have a list of flights. Each flight has a flight number, destination, departure time, gate, and status. Render them all as rows in a table.

**Requirements:**

1. Create `src/FlightBoard.jsx`
2. Inside it, define a `const flights = [...]` — an array of at least 5 flight objects
3. Render an HTML `<table>` with a header row (`Flight`, `To`, `Time`, `Gate`, `Status`)
4. Generate one `<tr>` per flight — **without writing the rows by hand**
5. Import and render `<FlightBoard />` inside `App.jsx`, below the header

**Constraint reminder:** no CSS. A plain `<table>` has built-in structure, which is exactly why we're using one.

### Stretch goals

- Add a `<caption>` to the table showing how many flights there are, using `flights.length`
- Sort the flights by departure time before rendering (hint: `.sort()`)

---

## 2. Detailed Notes

### 2.1 The core realisation

In Django templates you'd write:

```django
{% for flight in flights %}
  <tr><td>{{ flight.number }}</td></tr>
{% endfor %}
```

React has **no loop syntax**. There is no `{% for %}`, no `v-for`, no `ng-repeat`. And that's deliberate.

Remember from Problem 1: JSX is just JavaScript expressions. So to render a list, you don't need a template feature — you need a JavaScript feature that **turns an array of data into an array of elements**.

That feature is `.map()`.

> **This is the single most important idea in this lesson:** React didn't invent a looping mechanism because JavaScript already had one. Everything in JSX is "just JavaScript" — and that principle will keep saving you.

### 2.2 JavaScript refresher: `.map()`

Since your JS is at beginner level, let's build this up properly. `.map()` is an array method that:

1. Runs a function on **every** item in an array
2. Collects each returned value
3. Returns a **new** array of the same length

```js
const numbers = [1, 2, 3]
const doubled = numbers.map(function (n) {
  return n * 2
})

console.log(doubled)   // [2, 4, 6]
console.log(numbers)   // [1, 2, 3]  ← original untouched
```

The same thing with arrow function syntax, which is what you'll see everywhere in React:

```js
const doubled = numbers.map((n) => {
  return n * 2
})

// and the short form — no braces means "return this automatically"
const doubled = numbers.map((n) => n * 2)
```

> **Callout — implicit return.** `(n) => n * 2` returns `n * 2` without the word `return`. But `(n) => { n * 2 }` returns `undefined`, because braces start a function body, not an expression. This distinction will bite you in JSX, so read it twice.

`.map()` doesn't care what you return. Return strings, return objects — **return JSX elements**:

```js
const names = ["Asha", "Ravi"]
const elements = names.map((name) => <li>{name}</li>)

// elements is now:
// [ {type:'li', props:{children:'Asha'}},
//   {type:'li', props:{children:'Ravi'}} ]
```

You now have an **array of React elements**.

### 2.3 React renders arrays automatically

Here's the piece that makes it all click: when React sees an array inside `{ }`, it renders every element in it, one after another.

```jsx
function NameList() {
  const names = ["Asha", "Ravi", "Meera"]

  return (
    <ul>
      {names.map((name) => <li>{name}</li>)}
    </ul>
  )
}
```

Renders:

```html
<ul>
  <li>Asha</li>
  <li>Ravi</li>
  <li>Meera</li>
</ul>
```

No loop keyword. No template directive. Just an array of objects that React knows how to walk.

### 2.4 Arrays of objects

Real data isn't strings — it's records. Exactly like rows from a Postgres query or a DRF serializer's output:

```js
const flights = [
  { number: "6E 204", to: "Delhi",     time: "06:15", gate: "A3", status: "On Time" },
  { number: "AI 502", to: "Mumbai",    time: "07:00", gate: "B1", status: "Delayed" },
]
```

Mapping over it, you access fields with dot notation:

```jsx
{flights.map((flight) => (
  <tr>
    <td>{flight.number}</td>
    <td>{flight.to}</td>
  </tr>
))}
```

> **Callout — why the parentheses after `=>`?**
> `(flight) => (` ... `)` uses implicit return with a parenthesised multi-line expression. If you wrote `(flight) => {` you'd have opened a function body and would need an explicit `return`. Both work — but forgetting the `return` after using `{` is the #1 cause of "my list renders nothing."

### 2.5 The `key` prop — you WILL see this warning

Run your solution and open the browser console. You'll find:

```
Warning: Each child in a list should have a unique "key" prop.
```

This is not noise. Fix it every time.

**The fix:**

```jsx
{flights.map((flight) => (
  <tr key={flight.number}>
    ...
  </tr>
))}
```

**Why it exists.** Remember that React keeps a tree of element objects and diffs the new tree against the old one. For a list, React has to answer: *"is this the same row as before, or a different one?"*

Without a key, React falls back to comparing by **position**. Position is a terrible identity. If you insert a flight at the top of the list, every row shifts down one slot, and React concludes that *every row changed* — so it rewrites the whole list instead of inserting one row.

With a key, React matches rows by identity. Insert at the top, and React inserts exactly one DOM node and leaves the rest alone.

**Rules for keys:**

| Rule | Reason |
|---|---|
| Must be **unique among siblings** | Only needs to be unique within that one list, not globally |
| Must be **stable** across renders | Same item → same key, every time |
| Goes on the **outermost** element inside `.map()` | Not on a child inside it |
| Use a real ID from your data | `flight.id`, `user.id` — your database already gives you one |
| ❌ Don't use `Math.random()` | New key every render → React destroys and rebuilds everything |
| ⚠️ Avoid array index as key | Fine only if the list never reorders, never filters, never inserts |

> **Callout — the index-as-key bug, in one sentence:**
> If you use `key={index}` and the list can reorder, React will keep the old DOM node (with its typed-in input text, its checkbox state, its scroll position) and only swap the text — so your data moves but your UI state doesn't follow it. This produces genuinely baffling bugs. Use real IDs.

Since your flight numbers are unique, `key={flight.number}` is legitimate here.

### 2.6 Extracting a Row component

Once a row gets complicated, pull it out. But note where the key goes:

```jsx
// ✅ key on the component being mapped
{flights.map((f) => <FlightRow key={f.number} flight={f} />)}
```

The key belongs on the element **returned by `.map()`**, not inside `FlightRow`'s own JSX. React needs it at the point where the list is built.

(`flight={f}` is passing a **prop** — that's Problem 4. You can use it now; understanding comes then.)

### 2.7 The pattern you'll use for the rest of your career

```jsx
{someArray.map((item) => (
  <Element key={item.id}>
    {item.someField}
  </Element>
))}
```

Memorise the shape. Table rows, dropdown options, cards, sidebar links, chat messages, search results — all of it is this one pattern.

---

## 3. Concepts to Remember

| Concept | One-liner |
|---|---|
| No loop syntax in JSX | JSX is JavaScript; use `.map()`, not a template directive |
| `.map()` | Transforms every array item, returns a **new** array of the same length |
| Arrow implicit return | `x => x * 2` returns; `x => { x * 2 }` returns `undefined` |
| React renders arrays | An array of elements inside `{ }` renders sequentially |
| `key` prop | Gives each list item a stable identity so React can diff efficiently |
| Key placement | On the outermost element produced inside `.map()` |
| Index as key | Only safe for static lists that never reorder or filter |
| Keys are not props | A component **cannot** read its own `key` — it's for React's internals |

### Common mistakes checklist

- [ ] Used `{` after `=>` and forgot `return`
- [ ] Put `key` on a `<td>` instead of the `<tr>`
- [ ] Used `Math.random()` as key
- [ ] Ignored the console warning
- [ ] Wrote `flights.map` without wrapping it in `{ }` inside JSX

---

## 4. Interview Framing

Say these out loud. Explaining is how you find the gaps in your own understanding.

**Q: "How do you render a list in React?"**

> "I map over the array and return a JSX element for each item. React renders arrays of elements natively, so there's no special loop syntax — it's just a JavaScript array method. Each element gets a `key` prop with a stable unique identifier from the data."

**Q: "What is the `key` prop and why does React need it?"**

> "React reconciles by diffing the new element tree against the previous one. For lists it needs to know which item is which across renders. Without a key it matches by index, so inserting or reordering makes it think everything changed and it rebuilds the list. A key gives each item a stable identity, so React can move or reuse existing DOM nodes and only patch what actually changed."

**Q: "Why shouldn't you use the array index as a key?"**

> "Because the index describes position, not identity. If the list is reordered, filtered, or has an item inserted, the same index now points to different data. React reuses the DOM node associated with that index, so component state tied to that node — input values, focus, animation state — stays attached to the wrong item. It's only safe for a list that is static and append-only."

**Q: "Can a component read its own `key`?"**

> "No. `key` is consumed by React during reconciliation and is never passed through to the component as a prop. If the component needs the ID, you pass it separately, e.g. `key={item.id} id={item.id}`."

**Follow-up you should be ready for:** *"What if my data has no unique ID?"*

> "Then I generate one at the point where the data enters my app — when I fetch or create it — and store it with the item, so it stays stable across renders. Generating it during render would produce a new key every time and defeat the purpose."

---

## 5. Solution

*Attempt the problem fully before reading this. Struggling first is what makes the explanation stick.*

<details>
<summary>Click to reveal</summary>

### `src/FlightBoard.jsx`

```jsx
const flights = [
  { number: "6E 204", to: "Delhi",     time: "06:15", gate: "A3",  status: "On Time" },
  { number: "AI 502", to: "Mumbai",    time: "07:00", gate: "B1",  status: "Delayed" },
  { number: "UK 811", to: "Hyderabad", time: "07:45", gate: "A7",  status: "Boarding" },
  { number: "SG 132", to: "Chennai",   time: "08:20", gate: "C2",  status: "On Time" },
  { number: "6E 998", to: "Kolkata",   time: "09:05", gate: "B4",  status: "Cancelled" },
]

function FlightBoard() {
  return (
    <table border="1">
      <caption>{flights.length} departures</caption>
      <thead>
        <tr>
          <th>Flight</th>
          <th>To</th>
          <th>Time</th>
          <th>Gate</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {flights.map((flight) => (
          <tr key={flight.number}>
            <td>{flight.number}</td>
            <td>{flight.to}</td>
            <td>{flight.time}</td>
            <td>{flight.gate}</td>
            <td>{flight.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default FlightBoard
```

### `src/App.jsx`

```jsx
import AirportHeader from './AirportHeader'
import FlightBoard from './FlightBoard'

function App() {
  return (
    <div>
      <AirportHeader />
      <h2>Departures</h2>
      <FlightBoard />
    </div>
  )
}

export default App
```

### Stretch: sorted by time

`.sort()` mutates the array in place, which is a bad habit in React. Copy first with the spread operator:

```jsx
const sorted = [...flights].sort((a, b) => a.time.localeCompare(b.time))
```

Then map over `sorted` instead of `flights`. Because these times are zero-padded `"HH:MM"` strings, plain string comparison sorts them correctly.

> **Note on `border="1"`:** that's an HTML attribute, not CSS — it keeps us honest with the no-CSS rule while making the table readable. We'll drop it once we're past Phase 1.

### Extracted-row variant

```jsx
function FlightRow({ flight }) {
  return (
    <tr>
      <td>{flight.number}</td>
      <td>{flight.to}</td>
      <td>{flight.time}</td>
      <td>{flight.gate}</td>
      <td>{flight.status}</td>
    </tr>
  )
}

// used as:
{flights.map((flight) => <FlightRow key={flight.number} flight={flight} />)}
```

</details>

---

## Next up

**Problem 3 — Flight Status Badges:** conditional rendering. You'll make "Delayed" and "Cancelled" look different from "On Time" using `&&`, ternaries, and early returns — and learn the falsy-value trap that catches almost everyone.
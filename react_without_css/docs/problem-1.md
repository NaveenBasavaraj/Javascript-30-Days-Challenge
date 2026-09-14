---

# Problem 1 — Hello Dashboard

**Goal:** Build a small airport dashboard header by hand, using multiple components.

### What this problem will teach you
1. What a component actually *is*
2. JSX — the HTML-looking stuff inside JavaScript
3. `export` / `import` — how files talk to each other
4. Composition — components made of other components
5. Embedding JavaScript values into markup with `{ }`

---

## Phase 1 — The minimum theory to attempt it

**A component is a JavaScript function that returns markup.** That's the entire definition.

```jsx
function Greeting() {
  return <p>Hello</p>
}
```

Three non-negotiable rules:

| Rule | Example |
|---|---|
| Name must start with a **Capital letter** | `Greeting` ✅  `greeting` ❌ |
| It must **return** something | `return <p>Hi</p>` |
| It returns **one** top-level element | wrap siblings in `<div>` |

**Using a component** looks like an HTML tag:

```jsx
function App() {
  return (
    <div>
      <Greeting />
      <Greeting />
    </div>
  )
}
```

That renders "Hello" twice. Components are reusable by nature.

**Injecting JavaScript** — curly braces `{ }` are an escape hatch back into JS:

```jsx
function Greeting() {
  const name = "Naveen"
  return <p>Hello {name}</p>
}
```

Anything inside `{ }` is evaluated as a JavaScript *expression*. `{2 + 2}` renders `4`. `{name.toUpperCase()}` works too.

> **Callout — why `return (` with parentheses?**
> JavaScript auto-inserts semicolons after `return` if the next thing is on a new line. Without parentheses, `return` followed by a newline returns `undefined` and your component renders nothing. The parentheses tell JS "the expression continues below." Use them any time your JSX spans more than one line. This bug bites every beginner exactly once.

---

## Phase 2 — Your task

Create **two new files** inside `src/`:

**`src/AirportHeader.jsx`** — a component that renders:
- an `<h1>` with the airport name
- a `<p>` with the airport code (store it in a `const` and inject it with `{ }`)

**`src/App.jsx`** — modify it to:
- `import` your `AirportHeader`
- render it inside a `<div>`
- also render an `<h2>` below it saying "Departures"

Here's the import/export mechanism, since you haven't met it yet:

```jsx
// in the file that defines it
export default AirportHeader

// in the file that uses it
import AirportHeader from './AirportHeader'
```

### Stretch (attempt it, failing is fine)
Add a third component `<Clock />` in its own file that renders the current time using `new Date().toLocaleTimeString()`. It won't tick — that's expected and we fix it in Problem 14.

---


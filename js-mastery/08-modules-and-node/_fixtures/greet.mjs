/* One default export and one named export. */
export default function greet(name) {
  return `Hello, ${name}`;
}

export function shout(text) {
  return `${text.toUpperCase()}!`;
}

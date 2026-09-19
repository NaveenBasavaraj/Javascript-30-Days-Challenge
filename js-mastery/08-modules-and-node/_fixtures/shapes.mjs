/* A tiny module for the exercises in 02-esm.mjs to import. */
export const PI = 3.14159;

export function area(r) {
  return PI * r * r;
}

export let counter = 0;

export function bump() {
  counter += 1;
  return counter;
}

/* A tiny CommonJS module used by 01-commonjs.js. */
const PI = 3.14159;

module.exports.PI = PI;
module.exports.area = (r) => PI * r * r;

// Counts how many times this file's body actually ran.
module.exports.loadCount = (module.exports.loadCount || 0) + 1;

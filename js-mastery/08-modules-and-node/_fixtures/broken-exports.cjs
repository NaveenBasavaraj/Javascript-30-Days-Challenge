/* The classic mistake: this reassigns a local variable and exports
 * nothing. Node still hands callers the original (empty) object. */
exports = function double(n) {
  return n * 2;
};

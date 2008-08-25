/**
 * Validates that a value only contains numbers
 *
 * @builtin
 */
v2.Validator.reg('numeric', function(field, value, params) {
  return /^[0-9]*$/.test(value);
});

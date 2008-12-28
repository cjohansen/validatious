/**
 * Validates that a value only contains numbers.
 *
 * @builtin
 * @depends ../core/validator.js
 */
v2.Validator.reg('numeric', function(field, value, params) {
  return /^[0-9]*(\.[0-9]+)?$/.test(value);
});

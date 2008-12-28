/**
 * Validates that a value only contains letters and numbers.
 *
 * @builtin
 * @depends ../core/validator.js
 */
v2.Validator.reg('alphanum', function(field, value, params) {
  return /^([a-zA-Z\u00A1-\uFFFF0-9])*$/.test(value);
});

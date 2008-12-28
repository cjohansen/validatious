/**
 * Validates that a value contans only letters.
 *
 * @builtin
 * @depends ../core/validator.js
 */
v2.Validator.reg('alpha', function(field, value, params) {
  return /^[a-zA-Z\u00A1-\uFFFF]*$/.test(value);
});

/**
 * Validates that a value contans only letters.
 *
 * @builtin
 */
v2.Validator.reg('alpha', function(field, value, params) {
  return /^[a-zA-Z\u00A1-\uFFFF]*$/.test(value);
});

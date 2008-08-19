/**
 * Validates that a value only contains letters and numbers
 */
v2.Validator.reg('alphanum', function(field, value, params) {
  return /^[a-zA-Z0-9]*$/.test(value);
});

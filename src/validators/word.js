/**
 * Validates that a value contans only word characters
 *
 * @builtin
 */
v2.Validator.reg('word', function(field, value, params) {
  return /^[a-zA-Z_\s\t\-æøåÆØÅ]*$/.test(value);
});

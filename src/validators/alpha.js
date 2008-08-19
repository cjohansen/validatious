/**
 * Validates that a value contans only letters
 */
v2.Validator.reg('alpha', function(field, value, params) {
  return /^[a-zA-ZæøåÆØÅ]*$/.test(value);
});

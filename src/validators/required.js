/**
 * Validates that a field has a value.
 *
 * @builtin
 */
v2.Validator.reg('required', function(field, value, params) {
  return !v2.empty(value);
}, null, null, 'not-empty', false);

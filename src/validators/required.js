/**
 * Validates that a field has a value.
 *
 * @builtin
 */
v2.Validator.reg('required', function(field, value, params) {
  return !v2.empty(value) && !(typeof value.length !== 'undefined' && value.length === 0);
}, null, null, 'not-empty', false);

/**
 * Validates that a field has a value
 *
 * When validating checkboxes with the required validator you can use it in
 * two ways: with no parameters
 */
v2.Validator.reg('required', function(field, value, params) {
  return !v2.empty(value);
}, null, null, 'not-empty', false);

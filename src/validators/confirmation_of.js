/**
 * Validates that a value is a confirmation of another field.
 *
 * @builtin
 * @depends ../core/validator.js
 */
v2.Validator.reg('confirmation-of', function(field, value, params) {
  return value === v2.$f(params[0]).getValue();
}, 'field-id', '${field} should be an exact match', null, false);

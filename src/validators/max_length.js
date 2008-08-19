/**
 * Validates the length of a field; the first parameter sets the maximum
 * allowed length.
 */
v2.Validator.reg('max-length', function(field, value, params) {
  return value.length < params[0];
}, 'max');

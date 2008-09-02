/**
 * Validates the length of a field; the first parameter sets the maximum
 * allowed length. The length parameter is available in error messages as
 * <code>${max}</code>.
 *
 * @builtin
 */
v2.Validator.reg('max-length', function(field, value, params) {
  return value.length < params[0];
}, 'max');

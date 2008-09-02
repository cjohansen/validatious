/**
 * Validate the length of a field; the first parameter sets the minimum length
 * required. The length parameter is available in error messages as
 * <code>${min}</code>.
 *
 * @builtin
 */
v2.Validator.reg('min-length', function(field, value, params) {
  return value.length >= params[0];
}, 'min');

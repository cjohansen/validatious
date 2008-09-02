/**
 * Validates that a value is bigger than params[0]. Mostly for numbers, but
 * it'll work for strings as well. The value parameter is available in error messages as
 * <code>${min}</code>.
 *
 * @builtin
 */
v2.Validator.reg('min-val', function(field, value, params) {
  return value >= params[0];
}, 'min');

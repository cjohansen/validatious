/**
 * Validates that a value is no bigger than params[0]. Mostly for numbers, but
 * also works for strings. The value parameter is available in error messages as
 * <code>${max}</code>.
 *
 * @builtin
 */
v2.Validator.reg('max-val', function(field, value, params) {
  return value <= params[0];
}, 'max');

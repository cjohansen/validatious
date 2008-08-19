/**
 * Validates that a value is no bigger than params[0]. Mostly for numbers, but
 * also works for strings.
 */
v2.Validator.reg('max-val', function(field, value, params) {
  return value <= params[0];
}, 'max');
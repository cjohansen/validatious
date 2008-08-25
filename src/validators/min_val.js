/**
 * Validates that a value is bigger than params[0]. Mostly for numbers, but
 * it'll work for strings as well.
 *
 * @builtin
 */
v2.Validator.reg('min-val', function(field, value, params) {
  return value >= params[0];
}, 'min');

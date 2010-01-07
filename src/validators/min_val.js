/**
 * Validates that a number is bigger than params[0]. The value parameter is
 * available in error messages as <code>${min}</code>.
 *
 * @builtin
 * @depends ../core/validator.js
 */
v2.Validator.reg('min-val', function(field, value, params) {
  return +value >= +params[0];
}, 'min');

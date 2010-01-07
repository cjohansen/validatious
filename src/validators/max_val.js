/**
 * Validates that a number is no bigger than params[0]. The value parameter is
 * available in error messages as <code>${max}</code>.
 *
 * @builtin
 * @depends ../core/validator.js
 */
v2.Validator.reg('max-val', function(field, value, params) {
  return +value <= params[0];
}, 'max');

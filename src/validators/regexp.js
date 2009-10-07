/**
 * Validates against custom regexp
 *
 * @builtin
 * @depends ../core/validator.js
 */
v2.Validator.reg('regexp', function(field, value, params) {
  return params && params[0] && new RegExp(params[0]).test(value);
});

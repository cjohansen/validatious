/**
 * Validates a value as an email
 *
 * @builtin
 */
v2.Validator.reg('email', function(field, value, params) {
  return /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(value);
});

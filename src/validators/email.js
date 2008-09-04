/**
 * Validates a value as an email address.
 *
 * @builtin
 */
v2.Validator.reg('email', function(field, value, params) {
  return new RegExp("^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$").test(value);
});

/**
 * Validates a value as an email address.
 *
 * @builtin
 * @depends ../core/validator.js
 */
v2.Validator.reg('email', function(field, value, params) {
  // This doesn't compress... http://www.regular-expressions.info/email.html
  return /^[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(value);
});

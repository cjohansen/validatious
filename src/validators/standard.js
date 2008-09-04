(function() {
  var v = v2.Validator;
/**
 * Validates that a value is bigger than params[0]. Mostly for numbers, but
 * it'll work for strings as well. The value parameter is available in error messages as
 * <code>${min}</code>.
 *
 * @builtin
 */
v.reg('min-val', function(field, value, params) {
  return value >= params[0];
}, 'min');

/**
 * Validates that a value is a valid URL.
 *
 * @builtin
 */
v.reg('url', function(field, value, params) {
  return /^(http|https|ftp):\/\/(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+)(:(\d+))?\/?/i.test(value);
});

/**
 * Validates that a value is no bigger than params[0]. Mostly for numbers, but
 * also works for strings. The value parameter is available in error messages as
 * <code>${max}</code>.
 *
 * @builtin
 */
v.reg('max-val', function(field, value, params) {
  return value <= params[0];
}, 'max');

/**
 * Validates that a value only contains letters and numbers.
 *
 * @builtin
 */
v.reg('alphanum', function(field, value, params) {
  return /^([a-zA-Z\u00A1-\uFFFF0-9])*$/.test(value);
});

/**
 * Validates that a value only contains numbers.
 *
 * @builtin
 */
v.reg('numeric', function(field, value, params) {
  return /^[0-9]*(\.[0-9]+)?$/.test(value);
});

/**
 * Validates that a value contans only letters.
 *
 * @builtin
 */
v.reg('alpha', function(field, value, params) {
  return /^[a-zA-Z\u00A1-\uFFFF]*$/.test(value);
});

/**
 * Validates the length of a field; the first parameter sets the maximum
 * allowed length. The length parameter is available in error messages as
 * <code>${max}</code>.
 *
 * @builtin
 */
v.reg('max-length', function(field, value, params) {
  return value.length < params[0];
}, 'max');

/**
 * Validates that a field has a value.
 *
 * @builtin
 */
v.reg('required', function(field, value, params) {
  return !v2.empty(value);
}, null, null, 'not-empty', false);

/**
 * Validate the length of a field; the first parameter sets the minimum length
 * required. The length parameter is available in error messages as
 * <code>${min}</code>.
 *
 * @builtin
 */
v.reg('min-length', function(field, value, params) {
  return value.length >= params[0];
}, 'min');

/**
 * Validates that a value contains only letters, numbers, spaces, tabs,
 * underscores and dashes.
 *
 * @builtin
 */
v.reg('word', function(field, value, params) {
  return /^([a-zA-Z\u00A1-\uFFFF0-9_\-\s\t])*$/.test(value);
});

/**
 * Validates that a value is a confirmation of another field.
 *
 * @builtin
 */
v.reg('confirmation-of', function(field, value, params) {
  return value === v2.$f(params[0]).getValue();
}, 'field-id');

/**
 * Validates a value as an email address.
 *
 * @builtin
 */
v.reg('email', function(field, value, params) {
  // This doesn't compress... http://www.regular-expressions.info/email.html
  return /^[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(value);
});

})();

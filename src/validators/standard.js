(function() {
  var v = v2.Validator;
/**
 * Validates that a value is bigger than params[0]. Mostly for numbers, but
 * it'll work for strings as well.
 */
v.reg('min-val', function(field, value, params) {
  return value >= params[0];
}, 'min');

/**
 * Validates that a value is a valid URL
 */
v.reg('url', function(field, value, params) {
  return /^(http|https|ftp):\/\/(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+)(:(\d+))?\/?/i.test(value);
});

/**
 * Validates that a value is no bigger than params[0]. Mostly for numbers, but
 * also works for strings.
 */
v.reg('max-val', function(field, value, params) {
  return value <= params[0];
}, 'max');

/**
 * Validates that a value only contains letters and numbers
 */
v.reg('alphanum', function(field, value, params) {
  return /^[a-zA-Z0-9]*$/.test(value);
});

/**
 * Validates that a value only contains numbers
 */
v.reg('numeric', function(field, value, params) {
  return /^[0-9]*$/.test(value);
});

/**
 * Validates that a value contans only letters
 */
v.reg('alpha', function(field, value, params) {
  return /^[a-zA-ZæøåÆØÅ]*$/.test(value);
});

/**
 * Validates the length of a field; the first parameter sets the maximum
 * allowed length.
 */
v.reg('max-length', function(field, value, params) {
  return value.length < params[0];
}, 'max');

/**
 * Validates that a field has a value
 *
 * When validating checkboxes with the required validator you can use it in
 * two ways: with no parameters
 */
v.reg('required', function(field, value, params) {
  return !v2.empty(value);
}, null, null, 'not-empty', false);

/**
 * Validate the length of a field; the first parameter sets the minimum length
 * required.
 */
v.reg('min-length', function(field, value, params) {
  return value.length >= params[0];
}, 'min');

/**
 * Validates that a value contans only word characters
 */
v.reg('word', function(field, value, params) {
  return /^[a-zA-Z_\s\t\-æøåÆØÅ]*$/.test(value);
});

/**
 * Validates a value as an email
 */
v.reg('email', function(field, value, params) {
  return /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(value);
});

})();

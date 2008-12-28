/**
 * Validates that a value is a valid URL.
 *
 * @builtin
 * @depends ../core/validator.js
 */
v2.Validator.reg('url', function(field, value, params) {
  return /^(http|https|ftp):\/\/(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+)(:(\d+))?\/?/i.test(value);
});

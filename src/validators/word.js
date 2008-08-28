/**
 * Validates that a value contains only letters, numbers, spaces, tabs,
 * underscores and dashes.
 *
 * @builtin
 */
v2.Validator.reg('word', function(field, value, params) {
  return /^([a-zA-Z\u00A1-\uFFFF0-9_\-\s\t])*$/.test(value);
});

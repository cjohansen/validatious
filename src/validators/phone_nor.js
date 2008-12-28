/**
 * Validates that a value is a valid norwegian telephone number.
 *
 * @depends ../core/validator.js
 */
v2.Validator.reg('phone-nor', function(field, value, params) {
  return /^((00|\+)\d\d)?\d{8}$/.test(value.replace(/\s/g, ''));
});

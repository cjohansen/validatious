/**
 * Validates that a value is a valid norwegian car registration number (as in
 * license plates).
 *
 * @depends ../core/validator.js
 */
v2.Validator.reg('car-regnum-nor', function(field, value, params) {
  return /^[a-zA-Z]{1,2}[\s\t]*[0-9]{3,5}$/.test(value.replace(/\s/g, ''));
});

/**
 * Validates that a value is a valid norwegian car registration number
 */
v2.Validator.reg('car-regnum-nor', function(field, value, params) {
  return /^[a-zA-Z]{1,2}[0-9]{3,5}$/.test(value.replace(/\s/g, ''));
});

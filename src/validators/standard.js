/**
 * @fileOverview Adds validators
 */
(function() {
  var v = v2.Validator;
  var m = v2.Messages;

  /**
   * Validate the length of a field; the first parameter sets the minimum length
   * required.
   */
  v.reg('min-length', function(field, value, params) {
    return value.length >= params[0];
  }, m.minLength, 'min');

  /**
   * Validates the length of a field; the first parameter sets the maximum
   * allowed length.
   */
   v.reg('max-length', function(field, value, params) {
     return value.length < params[0];
  }, m.maxLength, 'max');

  /**
   * Validates that a value is bigger than params[0]. Mostly for numbers, but
   * it'll work for strings as well.
   */
  v.reg('min-val', function(field, value, params) {
    return value >= params[0];
  }, m.minVal, 'min');

  /**
   * Validates that a value is no bigger than params[0]. Mostly for numbers, but
   * also works for strings.
   */
  v.reg('max-val', function(field, value, params) {
    return value <= params[0];
  }, m.maxVal, 'max');

  /**
   * Validates a value as an email
   */
  v.reg('email', function(field, value, params) {
    return /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(value);
  }, m.email);

  /**
   * Validates that a value contans only letters
   */
  v.reg('alpha', function(field, value, params) {
    return /^[a-zA-ZæøåÆØÅ]*$/.test(value);
  }, m.alpha);

  /**
   * Validates that a value contans only word characters
   */
  v.reg('word', function(field, value, params) {
    return /^[a-zA-Z_\s\t\-æøåÆØÅ]*$/.test(value);
  }, m.alpha);

  /**
   * Validates that a value only contains numbers
   */
  v.reg('numeric', function(field, value, params) {
    return /^[0-9]*$/.test(value);
  }, m.numeric);

  /**
   * Validates that a value only contains letters and numbers
   */
  v.reg('alphanum', function(field, value, params) {
    return /^[a-zA-Z0-9]*$/.test(value);
  }, m.alphaNum);

  /**
   * Validates that a value is a valid URL
   */
  v.reg('url', function(field, value, params) {
    return /^(http|https|ftp):\/\/(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+)(:(\d+))?\/?/i.test(value);
  }, m.url);

  /**
   * Validates that a value is a valid norwegian telephone number
   */
  v.reg('phone-nor', function(field, value, params) {
    return /^((00|\+)\d\d)?\d{8}$/.test(value.replace(/\s/g, ''));
  }, m.phoneNor);

  /**
   * Validates that a value is a valid norwegian car registration number
   */
  v.reg('auto-regnum-nor', function(field, value, params) {
    return /^[a-zA-Z]{1,2}[0-9]{3,5}$/.test(value.replace(/\s/g, ''));
  }, m.autoRegNumNor);

  /**
   * Validates that a field has a value
   *
   * When validating checkboxes with the required validator you can use it in
   * two ways: with no parameters
   */
  v.reg('required', function(field, value, params) {
    return value !== null && value !== '';
  }, m.required, 'not-empty', false);

  /**
   * Checks that a value is a valid norwegian social security number
   */
  v.reg('ssn-nor',
    function(field, value, params) {
      var ok = true;
      var weights1 = [3, 7, 6, 1, 8, 9, 4, 5, 2, 1, 0];
      var weights2 = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2, 1];
      var sum1 = 0;
      var sum2 = 0;
      var ssn = value.strip();
      var nr = parseInt(ssn);

      if ((isNaN(nr)) || (ssn.length < 11)) {
        return false;
      }

      for (var x = 0; x < 11; x++) {
        var digit = ssn.charAt(x) - '0';
        sum1 = sum1 + (digit * weights1[x]);
        sum2 = sum2 + (digit * weights2[x]);
      }

      if ((sum1 % 11) == 0 && (sum2 % 11) == 0) {
        ok = true;
      } else {
        ok = false;
        var subStr = ssn.substring(6, 11);

        if (subStr == "00000") {
          subStr  = ssn.substring(0, 2);
          nr = parseInt(subStr);

          if ((nr >= 0) && (nr <= 31)) {
            subStr  = ssn.substring(2, 4);
            nr = parseInt (subStr);

            if ((nr >= 0) && (nr <= 12)) {
              ok = true;
            }
          }
        }
      }

      if (ssn.substring(6, 11) == "00000") {
        ok = false;
      }

      return ok;
    }, m.ssnNor
  );
})();

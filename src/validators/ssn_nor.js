/**
 * Checks that a value is a valid norwegian social security number
 */
v.reg('ssn-nor', function(field, value, params) {
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
});

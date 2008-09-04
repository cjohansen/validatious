<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/2002/REC-xhtml1-20020801/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" dir="ltr" lang="nb-NO">
  <head>
    <title>Test suite for Validatious 2.0 validator</title>
    <?php
        require 'utils/core.php';
        print scripts();
    ?>
    <script type="text/javascript" src="../src/validators/car_regnum_nor.js"></script>
    <script type="text/javascript" src="../src/validators/phone_nor.js"></script>
    <script type="text/javascript" src="../src/validators/ssn_nor.js"></script>
    <script type="text/javascript">
// Opera seems to fail if this function is missing
function test() {
    assertTrue(true);
}

function testAlpha() {
    var validator = v2.$v('alpha');
    var field = v2.$('el');
    var input = v2.$f('el');

    field.value = '';
    assertTrue(validator.test(input));

    field.value = 'abcABCÆØÅÉé';
    assertTrue(validator.test(input));

    field.value = 'asd ASD';
    assertFalse(validator.test(input));

    field.value = '213das';
    assertFalse(validator.test(input));
}

function testAlphanum() {
    var validator = v2.$v('alphanum');
    var field = v2.$('el');
    var input = v2.$f('el');

    field.value = '';
    assertTrue(validator.test(input));

    field.value = 'abcABCæøåÉé';
    assertTrue(validator.test(input));

    field.value = 'abcABCæøåÉé123';
    assertTrue(validator.test(input));

    field.value = '123';
    assertTrue(validator.test(input));

    field.value = '123a bc';
    assertFalse(validator.test(input));

    field.value = 'a_B';
    assertFalse(validator.test(input));
}

function testCarRegnumNor() {
    var validator = v2.$v('car-regnum-nor');
    var field = v2.$('el');
    var input = v2.$f('el');

    field.value = '';
    assertTrue(validator.test(input));

    // Cars
    field.value = 'ad12300';
    assertTrue('ad12300 fails', validator.test(input));

    // Caravans ++
    field.value = 'AD3202';
    assertTrue('ad12300 fails', validator.test(input));

    field.value = 'BC44490';
    assertTrue('BC44490 fails', validator.test(input));

    field.value = 'a453';
    assertTrue('a453 fails', validator.test(input));

    field.value = 'de234';
    assertTrue('de234 fails', validator.test(input));

    field.value = 'AD 34567';
    assertTrue('AD 34567 fails', validator.test(input));
}

function testConfirmationOf() {
    var validator = v2.$v('confirmation-of');
    var field = v2.$('el');
    var input = v2.$f('el');

    field.value = 'Text';
    assertTrue(validator.test(input, ['el2']));

    field.value = 'text';
    assertFalse(validator.test(input, ['el2']));

    field.value = 't E-xt';
    assertFalse(validator.test(input, ['el2']));
}

function testEmail() {
    var validator = v2.$v('email');
    var field = v2.$('el');
    var input = v2.$f('el');

    field.value = 'email@address.tld';
    assertTrue('email@address.tld fails', validator.test(input));

    field.value = 'email.address@then.tld';
    assertTrue('email.address@then.tld fails', validator.test(input));

    field.value = 'email.address+with@extra.tld';
    assertTrue('email.address+with@extra.tld fails', validator.test(input));

    field.value = 'email@tld';
    assertFalse('email@tld passes', validator.test(input));

    field.value = '.something@domain.tld';
    assertFalse('.something@domain.tld passes', validator.test(input));
}

function testMaxLength() {
    var validator = v2.$v('max-length');
    var field = v2.$('el');
    var input = v2.$f('el');

    field.value = 'Something';
    assertFalse('Something passes max length 9', validator.test(input, [9]));
    assertTrue('Something fails max length 10', validator.test(input, [10]));
    assertFalse('Something passes max length 8', validator.test(input, [8]));
}

function testMaxVal() {
    var validator = v2.$v('max-val');
    var field = v2.$('el');
    var input = v2.$f('el');

    field.value = 'something';
    assertTrue(validator.test(input, ['stop']));

    field.value = 4;
    assertTrue('4 with max val 4 is not valid', validator.test(input, [4]));
    assertTrue('4 with max val 5 is not valid', validator.test(input, [5]));
    assertFalse('4 with max val 3 is valid', validator.test(input, [3]));
}

function testMinLength() {
    var validator = v2.$v('min-length');
    var field = v2.$('el');
    var input = v2.$f('el');

    field.value = 'test';
    assertTrue(validator.test(input, [3]));
    assertTrue(validator.test(input, [4]));
    assertFalse(validator.test(input, [5]));
}

function testMinVal() {
    var validator = v2.$v('min-val');
    var field = v2.$('el');
    var input = v2.$f('el');

    field.value = 'Test';
    assertTrue(validator.test(input, ['Tea']));

    field.value = 4;
    assertTrue(validator.test(input, [3]));
    assertTrue(validator.test(input, [4]));
    assertFalse(validator.test(input, [5]));
}

function testNumeric() {
    var validator = v2.$v('numeric');
    var field = v2.$('el');
    var input = v2.$f('el');

    field.value = '345';
    assertTrue('345 is not valid', validator.test(input));

    field.value = '45,78';
    assertFalse('45,78 is valid', validator.test(input));

    field.value = '45.78';
    assertTrue('45.78 is not valid', validator.test(input));

    field.value = '67-';
    assertFalse('67- is valid', validator.test(input));

    field.value = 'asd';
    assertFalse('asd is valid', validator.test(input));
}

function testPhoneNor() {
    var validator = v2.$v('phone-nor');
    var field = v2.$('el');
    var input = v2.$f('el');

    field.value = '22 34 56 78';
    assertTrue(validator.test(input));

    field.value = '+47 22 34 67 89';
    assertTrue(validator.test(input));

    field.value = '0047 22 34 67 89';
    assertTrue(validator.test(input));

    field.value = '+47 934 17 480';
    assertTrue(validator.test(input));

    field.value = '934 17 480';
    assertTrue(validator.test(input));

    field.value = '93417480';
    assertTrue(validator.test(input));

    field.value = '555-1800-3456';
    assertFalse(validator.test(input));
}

function testRequired() {
    var validator = v2.$v('required');
    var field = v2.$('el');
    var input = v2.$f('el');

    field.value = 'Text';
    assertTrue(validator.test(input));

    field.value = '1';
    assertTrue(validator.test(input));

    field.value = '';
    assertFalse(validator.test(input));
}

function testUrl() {
    var validator = v2.$v('url');
    var field = v2.$('el');
    var input = v2.$f('el');

    field.value = 'www.someurl.com';
    assertFalse('www.someurl.com is valid', validator.test(input));

    field.value = 'http://www.someurl.com';
    assertTrue('http://www.someurl.com is not valid', validator.test(input));

    field.value = 'http://someurl';
    assertFalse('http://someurl is valid', validator.test(input));

    field.value = 'ftp://www.someurl.com/someUrl?hey=ho&yes';
    assertTrue('ftp://www.someurl.com/someUrl?hey=ho&yes is not valid', validator.test(input));

    field.value = 'something';
    assertFalse('something is valid', validator.test(input));

    field.value = 'http:/something';
    assertFalse('http:/something is valid', validator.test(input));
}

function testWord() {
    var validator = v2.$v('word');
    var field = v2.$('el');
    var input = v2.$f('el');

    field.value = 'ABC123';
    assertTrue('Uppercase letters and numbers does not make a word', validator.test(input));

    field.value = 'abc-123 Yup';
    assertTrue('Upper, lower, numbers and space does not make a word', validator.test(input));

    field.value = 'abc-123, Yup.';
    assertFalse('Upper, lower, numbers, comma, space and dot does makes a word', validator.test(input));

    field.value = 'abc~';
    assertFalse('Lower and tilde makes a word', validator.test(input));

    field.value = '|hey|';
    assertFalse('Pipe and lowercase make a word', validator.test(input));
}

function testMinLengthCheckboxes() {
    var validator = v2.$v('min-length');
    var field = v2.$('a1');
    var input = v2.$f('a1');

    assertTrue('min-length 2 with three checked fails', validator.test(input, [2]));
    assertTrue('min-length 3 with three checked fails', validator.test(input, [3]));
    assertFalse('min-length 4 with three checked succeeds', validator.test(input, [4]));

    v2.$('a4').checked = true;
    assertTrue('min-length 4 with four checked fails', validator.test(input, [4]));
}
    </script>
  </head>
  <body>
    <form>
      <fieldset>
        <input type="text" name="el" id="el" value="Text" />
        <input type="text" name="el2" id="el2" value="Text" />
        <input type="checkbox" name="a" value="1" id="a1" checked="checked" class="g_a" />
        <input type="checkbox" name="a" value="2" id="a2" checked="checked" class="g_a" />
        <input type="checkbox" name="a" value="3" id="a3" checked="checked" class="g_a" />
        <input type="checkbox" name="a" value="4" id="a4" class="g_a" />
      </fieldset>
    </form>
  </body>
</html>

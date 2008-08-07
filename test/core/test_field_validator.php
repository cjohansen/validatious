<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/2002/REC-xhtml1-20020801/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" dir="ltr" lang="nb-NO">
  <head>
    <title>Test suite for Validatious 2.0 field validator</title>
    <?php
        require '../utils/core.php';
        print scripts();
    ?>
    <script type="text/javascript">
// Opera seems to fail if this function is missing
function test() {
    assertTrue(true);
}

function testConstructorMinimal() {
    var field = v2.$f('field');
    var validator = v2.$v('min-length');
    var fv = new v2.FieldValidator(field, validator);

    assertNotNull(fv.__field);
    assertNotNull(fv.__validator);
    assertEquals(0, fv.__params.length);
    assertEquals(validator.__message.message, fv.__message.message);
}

function testConstructorSingleParam() {
    var field = v2.$f('field');
    var validator = v2.$v('min-length');
    var fv = new v2.FieldValidator(field, validator, 3);
    assertEquals(1, fv.__params.length);
    assertEquals(3, fv.__params[0]);
}

function testConstructorArrayParam() {
    var field = v2.$f('field');
    var validator = v2.$v('min-length');
    var fv = new v2.FieldValidator(field, validator, [3]);
    assertEquals(1, fv.__params.length);
    assertEquals(3, fv.__params[0]);
}

function testConstructorCustomErrorMsg() {
    var field = v2.$f('field');
    var validator = v2.$v('min-length');
    var fv = new v2.FieldValidator(field, validator, [3], new v2.Message('Error!'));
    assertEquals('Error!', fv.getMessages().join());
}

function testFieldValidatorTest() {
    var field = v2.$f('field');
    var validator = v2.$v('min-length');
    var fv = new v2.FieldValidator(field, validator, [3], new v2.Message('Error!'));
    assertTrue('fv.test() yielded ' + fv.getMessages().join(), fv.test());
    assertTrue('fv.validate() yielded ' + fv.getMessages().join(), fv.validate());

    field.getElements()[0].value = 'Go';
    assertFalse('fv.test() on Go yielded ' + fv.getMessages().join(), fv.test());
}
    </script>
  </head>
  <body>
    <form id="testForm">
      <fieldset>
        <input type="text" name="field" id="field" value="Text" />
      </fieldset>
    </form>
  </body>
</html>

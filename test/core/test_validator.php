<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/2002/REC-xhtml1-20020801/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" dir="ltr" lang="nb-NO">
  <head>
    <title>Test suite for Validatious 2.0 validator</title>
    <?php
        require '../utils/core.php';
        print scripts();
    ?>
    <script type="text/javascript">
// Opera seems to fail if this function is missing
function test() {
    assertTrue(true);
}

function tearDown() {
    document.getElementById('field').value = 'Hello';
    v2.Validator.validators = {};
}

function testConstructorNoAlias() {
    var validator = new v2.Validator('truth', function(value, params) {
        return true;
    }, new v2.Message("It's the truth!"));

    assertEquals('truth', validator.__name);
    assertNotNull(validator.__test);
    assertNotNull(validator.__message);
    assertEquals(Array, validator.__aliases.constructor);
    assertEquals(0, validator.__aliases.length);
}

function testConstructorStringAlias() {
    var validator = new v2.Validator('truth', function(value, params) {
        return true;
    }, new v2.Message("It's the truth!"), 'THE truth');

    assertEquals(Array, validator.__aliases.constructor);
    assertEquals(1, validator.__aliases.length);
}

function testConstructorArrayAlias() {
    var validator = new v2.Validator('truth', function(value, params) {
        return true;
    }, new v2.Message("It's the truth!"), ['THE truth', 'seriously']);

    assertEquals(Array, validator.__aliases.constructor);
    assertEquals(2, validator.__aliases.length);
}

function testAdd() {
    var validator = v2.Validator.add({ name: 'truth',
                                       fn: function(v, p) { return true; },
                                       message: 'Error message' });
    assertEquals('Validator is not of type v2.Validator', v2.Validator, validator.constructor);
    assertEquals('Validator message is not a v2.Message', v2.Message, validator.__message.constructor);
    assertEquals('Validator was not found with get', validator, v2.Validator.get('truth'));
}

function testGet() {
    var validator = v2.Validator.add({ name: 'truth',
                                       fn: function(v, p) { return true; },
                                       message: 'Error message',
                                       aliases: ['some', 'aliases'] });

    assertEquals('Get truth failed', validator, v2.Validator.get('truth'));
    assertEquals('Get aliases failed', validator, v2.Validator.get('aliases'));
    assertEquals('Get some failed', validator, v2.Validator.get('some'));
}

function testExecuteValidator() {
    var validator = new v2.Validator('value', function(field, value, params) {
        return value == params.join('');
    }, new v2.Message("Params != value"));

    var field = v2.InputElement.get('field');
    assertTrue('Value is not sum of parameters', validator.test(field, ['H', 'e', 'l', 'l', 'o']));

    v2.Validator.add({ name: 'truth',
                       fn: function(v, p) { return true; },
                       message: 'Error' });
    document.getElementById('field').value = '';
    assertTrue('Truth validator does not return true', v2.Validator.get('truth').test(field, []));

    v2.Validator.add({ name: 'no-truth',
                       fn: function(f, v, p) { return false; },
                       message: 'Error',
                       acceptEmpty: false });
    assertFalse('No truth validator returns true', v2.Validator.get('no-truth').test(field, []));
}

function testExecuteInverse() {
    var validator = new v2.Validator('value', function(field, value, params) {
        return value == params.join('');
    }, new v2.Message("Params != value"));

    var field = v2.InputElement.get('field');
    var fieldEl = field.getElements()[0];
    fieldEl.value = 'Hello';
    assertFalse(validator.test(field, ['H', 'e', 'l', 'l', 'o'], true));
    fieldEl.value = 'Hello!';
    assertTrue(validator.test(field, ['H', 'e', 'l', 'l', 'o'], true));
}
    </script>
  </head>
  <body>
    <!-- Safari gets thouroughly confused when there's test() and id="test" -->
    <form id="testForm">
      <fieldset>
        <input type="text" name="field" id="field" value="Hello" />
      </fieldset>
    </form>
  </body>
</html>
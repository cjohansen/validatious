<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/2002/REC-xhtml1-20020801/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" dir="ltr" lang="nb-NO">
  <head>
    <title>Test suite for Validatious 2.0 field</title>
    <?php
        require '../utils/core.php';
        print scripts();
    ?>
    <script type="text/javascript">
// Opera seems to fail if this function is missing
function test() {
    assertTrue(true);
}

function setUp() {
  var fieldset = v2.$('fs');
  fieldset.className = '';
  var lists = fieldset.getElementsByTagName('ul');

  for (var i = 0; i < lists.length; i++) {
    lists[i].parentNode.removeChild(lists[i]);
  }

  var field = v2.$('field');
  field.value = 'Text';
  field.style.display = 'inline';
  field.style.visibility = 'visible';
}

function testConstructor() {
    var field = new v2.Field('field');
    assertNotNull(field.__element);
    assertNotNull(field.__monitored);
    assertFalse(field.__monitored);
    assertFalse(field.instant);
    assertTrue(field.instantWhenValidated);

    var field = new v2.Field('field', true, false);
    assertFalse(field.instantWhenValidated);
    assertTrue(field.instant);
}

function testType() {
    var cfi = new v2.Field('field');
    assertEquals('field', cfi.type);
}

function testTest() {
    var field = new v2.Field('field');
    var flag = '';
    field.onSuccess = function() { flag = 'SUCCESS'; };
    field.onFailure = function() { flag = 'FAIL'; };

    field.addValidator('min-length', 3);
    assertTrue('Valid field does not validate', field.test());
    assertEquals('', flag);

    field.addValidator('min-length', [13]);
    assertFalse(field.element.getValue() + ' passes min-length 13 validator', field.test());
    assertEquals('', flag);

    document.getElementById('field').value = 'short';
    assertFalse(field.test());
}

function testValidate() {
    var field = new v2.Field('field');
    var flag = '';
    field.onSuccess = function() { flag = 'SUCCESS'; };
    field.onFailure = function() { flag = 'FAIL'; };

    field.addValidator('min-length', 3);
    assertTrue('Valid field does not validate', field.validate());
    assertEquals('Correct callback is not run', 'SUCCESS', flag);

    field.addValidator('min-length', 13);
    assertFalse(field.element.getValue() + ' passes min-length 13 validator', field.validate());
    assertEquals('Callback did not set flag=FAIL', 'FAIL', flag);

    var messages = field.getMessages();
    field.validate();
    assertEquals(messages.length, field.getMessages().length);
}

function testGetParent() {
    var field = new v2.Field('field');
    assertEquals(v2.$('f1'), field.getParent());
}
    </script>
  </head>
  <body>
    <form id="test">
      <fieldset id="fs">
        <div class="field" id="f1">
          <label for="field" id="label">Field #1</label>
          <input type="text" name="field" id="field" value="Text" />
        </div>
        <div class="field">
          <label for="field2" id="label2" title="Real field #2">Field #2</label>
          <input type="text" name="field2" id="field2" value="Text" />
        </div>
        <div class="field">
          <label for="field3" id="label3">Field #3</label>
          <input type="text" name="field3" id="field3" value="Text" title="Real field #3" />
        </div>
        <div class="field">
          <input type="text" name="field4" id="field4" value="Text" title="Real field #4" />
        </div>
        <div class="field">
          <input type="text" name="field5" id="field5" value="Text" />
        </div>
        <div class="field">
          <label for="field6" id="label6" title="Label for field 6">Field #6</label>
          <input type="text" name="field6" id="field6" value="Text" />
        </div>
        <div class="field">
          <input type="text" name="field7" value="Text" />
        </div>
      </fieldset>
    </form>
  </body>
</html>

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
  var fieldsets = document.getElementsByTagName('fieldset');

  for (var i = 0, lists, j; i < fieldsets.length; i++) {
    fieldsets[i].className = '';

    lists = fieldsets[i].getElementsByTagName('ul');

    for (j = 0; j < lists.length; j++) {
      lists[j].parentNode.removeChild(lists[j]);
    }
  }

  var divs = document.getElementsByTagName('div');

  for (i = 0; i < divs.length; i++) {
    divs[i].className = 'field';
  }

  var field = v2.$('field');
  field.value = 'Text';
  field.style.display = 'inline';
  field.style.visibility = 'visible';

  v2.Field.prototype.displayErrors = -1;
  v2.Field.prototype.positionErrorsAbove = true;
}

function testCallbacks() {
    var element = v2.$('field');
    var parent = v2.$(element.parentNode);

    var field = new v2.Field(element);
    field.addValidator('min-length', 13);
    assertFalse(field.test());

    field.onFailure();
    var list = parent.getElementsByTagName('ul');

    assertTrue('Parent does not have error', parent.hasClassName('error'));
    assertEquals(1, list.length);
    assertEquals(1, list[0].getElementsByTagName('li').length);

    field.onSuccess();
    assertFalse('Error has not been removed from parent', parent.hasClassName('error'));
    assertEquals(0, parent.getElementsByTagName('ul').length);

    var fieldset = new v2.Fieldset(v2.$('fs1'));
    fieldset.add(field);
    field.onFailure();
    assertFalse('Error created on field added to fieldset', parent.hasClassName('error'));
    assertNull(field.onSuccess());
}

function testMessagesOtherClassNames() {
  var element = v2.$('field');
  var parent = v2.$(element.parentNode);

  var field = new v2.Field(element);
  field.addValidator('min-length', 13);
  field.failureClass = 'warning';
  field.successClass = 'success';

  assertFalse(field.element.getValue() + ' passes min-length 13', field.validate());
  assertTrue(parent.className + ' does not contain "warning"', parent.hasClassName('warning'));

  element.value = 'This string should do it';
  assertTrue(field.element.getValue() + ' doesn\'t pass min-length 13', field.validate());
  assertTrue(parent.className + ' does not contain "success"', parent.hasClassName('success'));
}

function testNumberOfMessages() {
  var element = v2.$('field');
  var parent = v2.$(element.parentNode);
  element.value = 'a';

  var field = new v2.Field(element);
  field.addValidator('min-length', 13);
  field.addValidator('numeric');
  field.addValidator('email');

  var length = field.__validators.length;
  assertEquals('Added three validators, but __validators are ' + length, 3, length);
  assertFalse(field.validate());
  assertEquals('Invalid fields is ' + field.getInvalid().length + ', not 3', 3, field.getInvalid().length);
  length = parent.getElementsByTagName('li').length;
  assertEquals('Error list has ' + length + ' errors, not 3', 3, length);

  field.displayErrors = 1;
  assertFalse(field.validate());
  assertEquals(1, parent.getElementsByTagName('li').length);

  field.displayErrors = 2;
  assertFalse(field.validate());
  assertEquals(2, parent.getElementsByTagName('li').length);

  field.displayErrors = -1;
  assertFalse(field.validate());
  assertEquals(3, parent.getElementsByTagName('li').length);
}

function testNumberOfMessagesPrototype() {
  v2.Field.prototype.displayErrors = 1;
  var element = v2.$('field');
  var parent = v2.$(element.parentNode);

  var field = new v2.Field(element);
  field.addValidator('min-length', 13);
  field.addValidator('required');
  field.addValidator('email');

  assertFalse(field.validate());
  assertEquals(1, parent.getElementsByTagName('li').length);
}

function testMessagePosition() {
  var element = v2.$('field');
  var parent = v2.$(element.parentNode);

  var field = new v2.Field(element);
  field.addValidator('min-length', 13);

  var firstChild = function(el) {
    el = el.firstChild;

    while (el.nodeType !== 1) {
      el = el.nextSibling;
    }

    return el;
  };

  assertFalse(field.validate());
  assertEquals('ul', firstChild(parent).tagName.toLowerCase());

  field.positionErrorsAbove = false;
  assertFalse(field.validate());
  assertNotEquals('ul', firstChild(parent).tagName.toLowerCase());

  var tag = '';
  var node = parent.firstChild;

  do {
    if (node.nodeType == 1) {
      tag = node.tagName;
    }
  } while (node = node.nextSibling);

  assertEquals('ul', tag.toLowerCase());
}

function testMessagePositionPrototype() {
  var element = v2.$('field');
  var parent = v2.$(element.parentNode);

  v2.Field.prototype.positionErrorsAbove = false;
  var field = new v2.Field(element);
  field.addValidator('min-length', 13);

  assertFalse(field.validate());

  var tag = '';
  var node = parent.firstChild;

  do {
    if (node.nodeType == 1) {
      tag = node.tagName;
    }
  } while (node = node.nextSibling);

  assertEquals('ul', tag.toLowerCase());
}

function testFieldset() {
    var form = new v2.Form('test');
    var field = new v2.Field('field4');
    var field5 = new v2.Field('field5');
    var field6 = new v2.Field('field6');
    var field7 = new v2.Field('field7');
    var fieldset = new v2.Fieldset(v2.$('f567'));

    field.addValidator('email');
    form.add(field);

    field5.addValidator('min-length', 10);
    field6.addValidator('email');
    field7.addValidator('max-length', 3);
    fieldset.add(field5);
    fieldset.add(field6);
    fieldset.add(field7);
    form.add(fieldset);

    var errorClass = v2.Field.prototype.failureClass;

    assertFalse('Form validates', form.validate());
    assertTrue('Field 4 does not have error on parent', v2.$('f4').hasClassName(errorClass));
    assertFalse('Field 5 has error on parent', v2.$('f5').hasClassName(errorClass));
    assertFalse('Field 5 passes validation', field5.test());
    assertFalse('Field 6 has error on parent', v2.$('f6').hasClassName(errorClass));
    assertFalse('Field 6 passes validation', field6.test());
    assertFalse('Field 7 has error on parent', v2.$('f7').hasClassName(errorClass));
    assertFalse('Field 7 passes validation', field7.test());
    assertTrue('f567 does not have error', v2.$('f567').hasClassName(errorClass));
}
    </script>
  </head>
  <body>
    <form id="test">
      <fieldset id="fs1">
        <div class="field" id="f1">
          <label for="field" id="label">Field #1</label>
          <input type="text" name="field" id="field" value="Text" />
        </div>
        <div class="field" id="f2">
          <label for="field2" id="label2" title="Real field #2">Field #2</label>
          <input type="text" name="field2" id="field2" value="Text" />
        </div>
        <div class="field" id="f3">
          <label for="field3" id="label3">Field #3</label>
          <input type="text" name="field3" id="field3" value="Text" title="Real field #3" />
        </div>
        <div class="field" id="f4">
          <input type="text" name="field4" id="field4" value="Text" title="Real field #4" />
        </div>
        <div class="section" id="f567">
          <div class="field" id="f5">
            <input type="text" name="field5" id="field5" value="Text" />
          </div>
          <div class="field" id="f6">
            <label for="field6" id="label6" title="Label for field 6">Field #6</label>
            <input type="text" name="field6" id="field6" value="Text" />
          </div>
          <div class="field" id="f7">
            <input type="text" name="field7" value="Text" />
          </div>
        </div>
      </fieldset>
      <fieldset id="fs2">
        <div class="field" id="f8">
          <label for="field8" id="label">Field #8</label>
          <input type="text" name="field8" id="field8" value="Text" />
        </div>
        <div class="field" id="f9">
          <label for="field9" id="label9" title="Real field #9">Field #9</label>
          <input type="text" name="field9" id="field9" value="Text" />
        </div>
      </fieldset>
    </form>
  </body>
</html>

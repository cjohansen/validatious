<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/2002/REC-xhtml1-20020801/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" dir="ltr" lang="nb-NO">
  <head>
    <title>Test suite for Validatious 2.0 HTML declarative validation</title>
    <?php if (!isset($_REQUEST['src'])) { ?><script type="text/javascript" src="../../src/lib/add_dom_load_event.js"></script><?php } ?>
    <?php
        require '../utils/core.php';
        print scripts(array('extensions/html'));
    ?>
    <script type="text/javascript">
// Opera needs this
function test() {
    assert(true);
}

function testValidate() {
    var parent = v2.$(v2.$('field2').parentNode);

    assertFalse('field2 already has errors', parent.hasClassName('error'));
    v2.$('next').click();
    v2.wait(500);
    assertTrue('field2 does not have errors', parent.hasClassName('error'));
}

function testAddValidatorSimple() {
    var field = new v2.Field('field5');
    v2.html.Field.add(field, 'required');
    assertEquals(1, field.__validators.length);
}

function testAddValidatorInverted() {
    var field = new v2.Field('field6');
    v2.html.Field.add(field, 'not_required');

    assertEquals(1, field.__validators.length);
    assertTrue(field.__validators[0].invert);
}

function testAddValidatorParameters() {
    var field = new v2.Field('field7');
    v2.html.Field.add(field, 'min-length_5');

    assertEquals('5', field.get(0).__params[0]);
}

function testAddValidatorMessage() {
    var element = v2.$('field8');
    var field = new v2.Field(element);
    element.title = 'Please get a hold of your self';
    v2.html.Field.add(field, 'required');

    assertEquals('Please get a hold of your self', field.get(0).getMessages().join());
}

function testAddValidatorFull() {
    var field = new v2.Field('field9');
    v2.html.Field.add(field, 'required min-length_16 not_email not_exists this_doesnt_either');

    assertEquals(3, field.__validators.length);
    assertTrue(field.get(2).invert);
}

function testValidatorPrefix() {
  var field = new v2.Field('field10');
  var start = field.__validators.length;

  v2.html.Field.add(field, 'v2_required');
  assertEquals(start, field.__validators.length);

  v2.Validator.prefix = 'v2_';
  v2.html.Field.add(field, 'required');
  assertEquals(start, field.__validators.length);

  v2.html.Field.add(field, 'v2_required');
  assertEquals(start + 1, field.__validators.length);

  v2.Validator.prefix = '';
}
    </script>
    <style>
      .field {
          padding: 12px;
      }

      .error {
          border: 1px solid #c00;
      }

      .error .messages {
          color: #c00;
      }
    </style>
  </head>
  <body>
    <form id="testForm" class="validate">
      <fieldset>
        <div class="field">
          <label for="field1">Field 1</label>
          <input type="text" name="field1" id="field1" value="Text" class="min-length_4" />
        </div>
        <div class="field">
          <label for="field2">Field 2</label>
          <input type="text" name="field2" id="field2" value="Text" title="This field should be atleast 12 characters!" class
="min-length_12" />
        </div>
        <div class="field">
          <label for="field3">Field 3</label>
          <input type="text" name="field3" id="field3" value="Text" class="not_min-length_4" />
        </div>
        <div class="field">
          <label for="field4" title="E-mail">Enter your email</label>
          <input type="text" name="field4" id="field4" value="Text" class="required email" />
        </div>
      </fieldset>
      <fieldset>
        <div class="button"><input type="submit" name="next" value="Next" id="next" /></div>
        <div class="button"><input type="submit" name="prev" value="Previous" id="prev" /></div>
      </fieldset>
    </form>
    <form id="test2">
      <fieldset>
        <div class="field">
          <label for="field5">Field 5</label>
          <input type="text" name="field5" id="field5" value="Text" />
        </div>
        <div class="field">
          <label for="field6">Field 6</label>
          <input type="text" name="field6" id="field6" value="Text" />
        </div>
        <div class="field">
          <label for="field7">Field 7</label>
          <input type="text" name="field7" id="field7" value="Text" />
        </div>
        <div class="field">
          <label for="field8">Field 8</label>
          <input type="text" name="field8" id="field8" value="Text" />
        </div>
        <div class="field">
          <label for="field9">Field 9</label>
          <input type="text" name="field9" id="field9" value="Text" />
        </div>
        <div class="field">
          <label for="field10">Field 10</label>
          <input type="text" name="field10" id="field10" value="Text" />
        </div>
      </fieldset>
    </form>
  </body>
</html>

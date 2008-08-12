<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/2002/REC-xhtml1-20020801/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" dir="ltr" lang="nb-NO">
  <head>
    <title>Test suite for Validatious 2.0 composite form item</title>
    <?php
        require '../utils/core.php';
        print scripts();
    ?>
    <script type="text/javascript">
// Opera needs this
function test() {
    assert(true);
}

function testConstructor() {
    var formEl = document.getElementsByTagName('form')[0];
    var form = new v2.Form('test');
    assertEquals(formEl, form.__form);
}

function testAddButton() {
    var form = new v2.Form(document.getElementsByTagName('form')[0]);
    assertEquals(0, form.__buttons.length);

    form.addButton(document.getElementById('next'));
    assertEquals(1, form.__buttons.length);
}

function testValidate() {
    var form = new v2.Form(document.getElementsByTagName('form')[0]);
    var cfi = new v2.CompositeFormItem();
    cfi.test = function() { return false; };
    form.add(cfi);

    var event = { explicitOriginalTarget: document.getElementById('prev'),
                  preventDefault: function() {} };

    assertFalse(form.validate(event));

    form.addButton(document.getElementById('next'));
    assertTrue(form.validate(event));
}

function testInstance() {
    var test = document.getElementById('test');
    assertEquals(v2.Form.get('test'), v2.Form.get('test'));
    assertEquals(v2.Form.get('test'), v2.Form.get(test));
    assertEquals(v2.Form.get(test), v2.Form.get(test));
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
    <form id="test">
      <fieldset>
        <div class="field">
          <label for="field1">Field 1</label>
          <input type="text" name="field1" id="field1" value="Text" />
        </div>
        <div class="field">
          <label for="field2">Field 2</label>
          <input type="text" name="field2" id="field2" value="Text" />
        </div>
        <div class="field">
          <label for="field3">Field 3</label>
          <input type="text" name="field3" id="field3" value="Text" />
        </div>
      </fieldset>
      <fieldset>
        <div class="button"><input type="submit" name="next" value="Next" id="next" /></div>
        <div class="button"><input type="submit" name="prev" value="Previous" id="prev" /></div>
      </fieldset>
    </form>
  </body>
</html>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/2002/REC-xhtml1-20020801/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" dir="ltr" lang="nb-NO">
  <head>
    <title>Test suite for Validatious 2.0 fieldset</title>
    <?php
        require '../utils/core.php';
        print scripts();
    ?>
    <script type="text/javascript">
// Opera seems to fail if this function is missing
function test() {
    assertTrue(true);
}

function testConstructor() {
    var fieldset = new v2.Fieldset('fs');
    assertEquals(v2.$('fs'), fieldset.element);
}

function testType() {
    var cfi = new v2.Fieldset('fs');
    assertEquals('fieldset', cfi.type);
}

function testGetParent() {
    var fieldset = new v2.Fieldset('fs');
    assertEquals(v2.$('fs'), fieldset.getParent());
}
    </script>
  </head>
  <body>
    <form id="test">
      <fieldset id="fs">
        <label for="field" id="label">Field #1</label>
        <input type="text" name="field" id="field" value="Text" />
        <label for="field2" id="label2" title="Real field #2">Field #2</label>
        <input type="text" name="field2" id="field2" value="Text" />
        <label for="field3" id="label3">Field #3</label>
        <input type="text" name="field3" id="field3" value="Text" title="Real field #3" />
        <input type="text" name="field4" id="field4" value="Text" title="Real field #4" />
        <input type="text" name="field5" id="field5" value="Text" />
        <label for="field6" id="label6" title="Label for field 6">Field #6</label>
        <input type="text" name="field6" id="field6" value="Text" />
        <input type="text" name="field7" value="Text" />
      </fieldset>
    </form>
  </body>
</html>

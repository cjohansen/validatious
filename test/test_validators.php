<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/2002/REC-xhtml1-20020801/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" dir="ltr" lang="nb-NO">
  <head>
    <title>Test suite for Validatious 2.0 validator</title>
    <?php
        require 'utils/core.php';
        print scripts();
    ?>
    <script type="text/javascript">
// Opera seems to fail if this function is missing
function test() {
    assertTrue(true);
}

function testMinLength() {
    var mlv = v2.Validator.get('min-length');
    assertTrue('Text is not atleast 4 characters', mlv.test(v2.InputElement.get('el'), [4]));
    assertTrue('Text is not atleast 3 characters', mlv.test(v2.InputElement.get('el'), [3]));
    assertFalse('Text is not atleast 5 characters', mlv.test(v2.InputElement.get('el'), [5]));
}
    </script>
  </head>
  <body>
    <form>
      <fieldset>
        <input type="text" name="el" id="el" value="Text" />
      </fieldset>
    </form>
  </body>
</html>

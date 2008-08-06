<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/2002/REC-xhtml1-20020801/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" dir="ltr" lang="nb-NO">
  <head>
    <title>Test suite for Validatious 2.0 message</title>
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
    var msg = new v2.Message('A simple string');
    assertNotNull(msg.message);
    assertNotNull(msg.params);
    assertEquals(0, msg.params.length);

    msg = new v2.Message('Message for ${field}, type ${min} characters or more', ['field', 'min']);
    assertNotNull(msg.message);
    assertNotNull(msg.params);
    assertEquals(2, msg.params.length);
}

function testSetValues() {
    var msg = new v2.Message('Message for ${field}, type ${min} characters or more', ['field', 'min']);
    msg.values = ['zip', 3];
    assertNotNull(msg.values);
    assertEquals(msg.values.length, msg.params.length);
}

function testToString() {
    var msg = new v2.Message('Message for ${field}, type ${min} characters or more', ['field', 'min']);
    msg.values = ['zip', 3];
    assertEquals('Message for zip, type 3 characters or more', msg.toString());
}
    </script>
  </head>
  <body>
    <div id="test"></div>
  </body>
</html>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/2002/REC-xhtml1-20020801/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" dir="ltr" lang="nb-NO">
  <head>
    <title>Test suite for Validatious 2.0 interface</title>
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
    var TestInterface = new v2.Interface('TestInterface', 'doSth');
    assertEquals('TestInterface', TestInterface.name);
    assertEquals('function', typeof TestInterface.methods.push);
    assertEquals(1, TestInterface.methods.length);
}

function testEnsure() {
    var TestInterface = new v2.Interface('TestInterface', ['do', 'add']);
    var Undoable = new v2.Interface('Undoable', ['undo']);

    var impl = {
        do: function() {},
        undo: function() {}
    };

    assertFalse(ensure(impl, TestInterface));

    impl.add = 4;
    assertFalse(ensure(impl, TestInterface));

    impl.add = function() {};
    assertTrue('impl does not implement TestInterface correctly', ensure(impl, TestInterface));
    assertTrue('impl does not implement TestInterface and Undoable correctly', ensure(impl, [Undoable, TestInterface]));
}

function ensure(obj, ifs) {
    try {
        v2.Interface.ensure(obj, ifs);
        return true;
    } catch(e) {
        console.log(e);
    };

    return false;
}
    </script>
  </head>
  <body>
  </body>
</html>

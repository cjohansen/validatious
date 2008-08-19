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
    var cfi = new v2.CompositeFormItem();
    assertNotUndefined(cfi.__validators);
    assertNotUndefined(cfi.__errors);
    assertNotUndefined(cfi.__passOnAny);
    assertNotUndefined(cfi.__message);
}

function testAdd() {
    var cfi = new v2.CompositeFormItem();
    assertEquals(0, cfi.__validators.length);

    cfi.add(cfi);
    assertEquals(1, cfi.__validators.length);
}

function testGet() {
    var cfi = new v2.CompositeFormItem();
    var cfi2 = new v2.CompositeFormItem();

    cfi.add(cfi);
    cfi.add(cfi2);

    assertEquals(cfi, cfi.get(0));
    assertEquals(cfi2, cfi.get(1));

    assertEquals(2, cfi.get().length);
}

function testTest() {
    var cfi = new v2.CompositeFormItem();
    assertTrue(cfi.test());

    var cfi2 = new v2.CompositeFormItem();
    cfi.add(cfi2);
    cfi2.test = function() { return false; };

    var cfi3 = new v2.CompositeFormItem();
    cfi.add(cfi3);

    assertFalse(cfi.test());
}

function testTestWithAny() {
    var cfi = new v2.CompositeFormItem();
    var cfi2 = new v2.CompositeFormItem();
    var cfi3 = new v2.CompositeFormItem();

    cfi.add(cfi2);
    cfi2.test = function() { return false; };
    cfi.add(cfi3);

    assertFalse(cfi.test());
    assertEquals(cfi2, cfi.getInvalid()[0]);

    cfi.passOnAny(true);
    assertTrue(cfi.test());
}

// This functionality is not added in yet
function __testTestWithExceptions() {
    var cfi = new v2.CompositeFormItem();
    var cfi2 = new v2.CompositeFormItem();
    cfi.add(cfi2);
    cfi2.test = function() { return false; };
    assertFalse(cfi.test());

    cfi.addException(new v2.CompositeFormItem());
    assertTrue(cfi.__passExceptions());
    assertTrue(cfi.test());
}

function testValidate() {
    var cfi = new v2.CompositeFormItem();
    var cfi2 = new v2.CompositeFormItem();
    var cfi3 = new v2.CompositeFormItem();

    cfi.add(cfi2);
    cfi2.test = function() { return false; };
    cfi.add(cfi3);
    var flag = true;

    cfi.onFailure = function() {
        flag = false;
    };

    cfi.onSuccess = function() {
        flag = true;
    };

    assertFalse(cfi.validate());
    assertFalse(flag);
    assertEquals(cfi2, cfi.getInvalid()[0]);

    cfi.passOnAny(true);
    assertTrue(cfi.validate());
    assertTrue(flag);
    assertNull(cfi.getInvalid());
}

function testMessages() {
    var cfi = new v2.CompositeFormItem();
    var cfi2 = new v2.CompositeFormItem();
    var cfi3 = new v2.CompositeFormItem();

    cfi.add(cfi2);
    cfi.add(cfi3);
    cfi2.test = cfi3.test = function() { return false; };

    assertFalse(cfi.validate());
    assertEquals(Array, cfi.getMessages().constructor);
    assertEquals(0, cfi.getMessages().length);

    cfi2.setMessage('Tis the message');
    assertEquals('Message count expected to be 1, was ' + cfi.getMessages().length,
                 1, cfi.getMessages().length);

    cfi3.setMessage('Another message');
    assertEquals('Message count expected to be 2, was ' + cfi.getMessages().length,
                 2, cfi.getMessages().length);

    cfi.setMessage('A single message');
    assertEquals('Message count expected to be 1 with single message, was ' +
                 cfi.getMessages().length, 1, cfi.getMessages().length);
}

// This functionality is not added in yet
function __testAddException() {
    var field = new v2.CompositeFormItem();
    assertEquals(0, field.__exceptions.length);
    assertEquals(0, field.__exceptionFlags.length);

    field.addException(new v2.CompositeFormItem());
    assertEquals(1, field.__exceptions.length);
    assertEquals(1, field.__exceptionFlags.length);
    assertTrue(field.__exceptionFlags[0]);

    field.addException(new v2.CompositeFormItem(), true);
    assertEquals(2, field.__exceptions.length);
    assertEquals(2, field.__exceptionFlags.length);
    assertTrue(field.__exceptionFlags[1]);

    field.addException(new v2.CompositeFormItem(), false);
    assertEquals(3, field.__exceptions.length);
    assertEquals(3, field.__exceptionFlags.length);
    assertFalse(field.__exceptionFlags[2]);
}

// This functionality is not added in yet
function __testPassExceptions() {
    var field = new v2.CompositeFormItem();
    assertFalse('passExceptions does not return false with no exceptions', field.__passExceptions());

    field.addException(new v2.CompositeFormItem());
    field.addException(new v2.CompositeFormItem(), true);
    assertTrue(field.__passExceptions());

    field.addException(new v2.CompositeFormItem(), false);
    assertFalse('passExceptions returns true when an exception fails', field.__passExceptions());
}
    </script>
  </head>
  <body>
  </body>
</html>

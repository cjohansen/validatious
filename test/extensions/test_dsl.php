<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/2002/REC-xhtml1-20020801/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" dir="ltr" lang="nb-NO">
  <head>
    <title>Test suite for Validatious 2.0 DSL validation "language"</title>
    <?php if (!isset($_REQUEST['src'])) { ?><script type="text/javascript" src="../../src/lib/add_dom_load_event.js"></script><?php } ?>
    <?php
        require '../utils/core.php';
        print scripts(array('extensions/dsl'));
    ?>
    <script type="text/javascript">
// Opera needs this
function test() {
    assert(true);
}

function setUp() {
    v2.Form.forms = {};
}

function testStringIs() {
    var facade = "field1".is("required");
    var field = facade.item;
    assertEquals(v2.dsl.Field, facade.constructor);
    assertEquals(1, facade.item.__validators.length);
    assertTrue(field.test());

    field.element.getElements()[0].value = '';
    assertFalse(field.test());
}

function testStringIsAliases() {
    assertEquals("function", typeof "field1".isA);
    assertEquals("function", typeof "field1".isAn);
    assertEquals("function", typeof "field1".has);
    assertEquals("function", typeof "field1".hasA);
    assertEquals("function", typeof "field1".hasAn);
}

function testDslFieldConstructor() {
    var facade = new v2.dsl.Field('field1');
    var field = new v2.Field('field1');

    assertEquals(field.constructor, facade.item.constructor);
    assertEquals(field.element, facade.item.element);
}

function testDslFieldAddValidator() {
    var field = new v2.dsl.Field('field1');
    var result = field.addValidator('required');

    assertEquals(field, result);
    assertEquals(1, field.item.__validators.length);

    field.addValidator('min-length', 4, true);
    assertEquals(2, field.item.__validators.length);
    assertFalse(field.item.passOnAny());

    var flag = false;

    try {
        field.addValidator('max-length', 16, false);
    } catch(e) {
        flag = true;
    }

    assertTrue(flag);

    field = new v2.dsl.Field('field2');
    field.addValidator('required', null, false);
    assertTrue(field.item.passOnAny());
}

function testDslFieldAndOr() {
    var field = v2.dsl.Field('field1');
    var flag = true;

    try {
        field.and("required");
    } catch(e) {
        flag = false;
    }

    assertFalse(flag);

    try {
        field.or("required");
         flag = true;
    } catch(e) {
        flag = false;
    }

    assertFalse(flag);
}

function testDslFieldExplain() {
    var field = new v2.dsl.Field('field1');
    var element = v2.$('field1');
    var value = element.value;
    element.value = '';
    var flag = true;

    try {
        field.explain("Hey there!");
    } catch(e) {
        flag = false;
    }

    assertFalse(flag);

    field.addValidator("required");
    field.item.validate();

    var msg = field.item.getMessages().join();
    field.explain("Hey there!");
    field.item.validate();

    assertNotEquals(msg, field.item.getMessages().join());
    assertEquals("Hey there!", field.item.getMessages().join());

    element.value = value;
}

function testDslFieldExplainOneOfMany() {
    var field = "field1".is("required");
    assertNotUndefined(field.__currentValidator);
    assertNotNull(field.__currentValidator);

    field = "field1".is("required").andHas("min-length", 10).explain("10!").andIs("email");
    var element = v2.$("field1");
    var value = element.value;
    element.value = 'ab@bc.cd';
    field.item.validate();

    assertEquals("10!", field.item.getMessages().join());
    element.value = "abcd@abcom";
    field.item.validate();
    assertNotEquals("10!", field.item.getMessages().join());

    element.value = value;
}

function testDslFieldHelp() {
    var field = "field1".is("required").andHas("min-length", 13).help("Help!");
    field.item.validate();

    assertEquals("Help!", field.item.getMessages().join());
    assertNotEquals("Help!", field.item.__validators[0].getMessages().join());

    field = "field1".is("required").help("Help!").andHas("min-length", 13);
    field.item.validate();

    assertEquals("Help!", field.item.getMessages().join());
    assertNotEquals("Help!", field.item.__validators[0].getMessages().join());
}

function testDslWithName() {
    var field = "field1".is("required").withName("Fieldorama");
    assertEquals("Fieldorama", field.item.element.getName());
}

function testDslAddButtonButtonId() {
    var form = v2.dsl.validate("field1".is("required").andIs("email"));
    assertEquals(0, form.item.__buttons.length);

    form.on("next");
    assertEquals(1, form.item.__buttons.length);
}

function testDslAddButtonButtonParentId() {
    var form = v2.dsl.validate("field1".is("required").andIs("email"));
    assertEquals(0, form.item.__buttons.length);

    form.on("nextWrapper");
    assertEquals(1, form.item.__buttons.length);
}

function testDslAddButtonButtonElement() {
    var form = v2.dsl.validate("field1".is("required").andIs("email"));
    assertEquals(0, form.item.__buttons.length);

    form.on(v2.$("next"));
    assertEquals(1, form.item.__buttons.length);
}

function testDslAddButtonButtonParentElement() {
    var form = v2.dsl.validate("field1".is("required").andIs("email"));
    assertEquals(0, form.item.__buttons.length);

    form.on(v2.$("nextWrapper"));
    assertEquals(1, form.item.__buttons.length);
}

function testDslAddButtonButtonMixedArguments() {
    var form = v2.dsl.validate("field1".is("required").andIs("email"));
    assertEquals(0, form.item.__buttons.length);

    form.on(v2.$("nextWrapper"), "prev");
    assertEquals(2, form.item.__buttons.length);
}

function testDslFieldAliases() {
    var field = "field1".is("required");
    assertEquals("function", typeof field.orIs);
    assertEquals("function", typeof field.orIsA);
    assertEquals("function", typeof field.orIsAn);
    assertEquals("function", typeof field.orHas);
    assertEquals("function", typeof field.orHasA);
    assertEquals("function", typeof field.orHasAn);
    assertEquals("function", typeof field.andIs);
    assertEquals("function", typeof field.andIsA);
    assertEquals("function", typeof field.andIsAn);
    assertEquals("function", typeof field.andHas);
    assertEquals("function", typeof field.andHasA);
    assertEquals("function", typeof field.andHasAn);
}

function testDslCollectionExplain() {
    var collection = new v2.dsl.Collection();
    collection.item.add("field1".has("min-length", 8).item);
    collection.item.add("field2".has("min-length", 8).item);
    collection.explain("Sorry mate");

    collection.item.validate();
    assertEquals("Sorry mate", collection.item.getMessages().join());
}

function testDslExpose() {
    v2.dsl.expose();

    assertNotUndefined(validate);
    assertNotUndefined(validateAll);
    assertNotUndefined(validateAny);
    assertNotUndefined(and);
    assertNotUndefined(or);
}

function testDslValidateAll() {
    assertEquals(v2.dsl.validateAll, v2.dsl.validate);
    v2.dsl.expose();
    v2.Form.forms = {};

    validate("field1".is("required"), "field2".is("required"));
    assertEquals(2, v2.Form.get('testForm').__validators.length);
    var f1 = v2.$("field1");
    var f2 = v2.$("field2");
    var val1 = f1.value;
    var val2 = f2.value;
    f1.value = '';
    f2.value = '';

    v2.$('next').click();
    v2.wait(500);
    assertTrue(v2.$(f1.parentNode).hasClassName('error'));
    assertTrue(v2.$(f2.parentNode).hasClassName('error'));

    f1.value = 'a';
    f2.value = 'b';

    assertTrue(v2.Form.get('testForm').validate());
    assertFalse(v2.$(f1.parentNode).className, v2.$(f1.parentNode).hasClassName('error'));
    assertFalse(v2.$(f2.parentNode).className, v2.$(f2.parentNode).hasClassName('error'));

    f1.value = val1;
    f2.value = val2;
}

function testDslValidateAny() {
    v2.dsl.expose();
    v2.Form.forms = {};

    validateAny("field1".is("required"), "field2".is("required"));
    assertEquals(2, v2.Form.get('testForm').__validators.length);
    var f1 = v2.$("field1");
    var f2 = v2.$("field2");
    var val1 = f1.value;
    var val2 = f2.value;
    f1.value = '';
    f2.value = '';

    v2.$('next').click();
    v2.wait(500);
    assertTrue(v2.$(f1.parentNode).hasClassName('error'));
    assertTrue(v2.$(f2.parentNode).hasClassName('error'));

    f1.value = 'a';

    assertTrue(v2.Form.get('testForm').validate());
    assertFalse(v2.$(f1.parentNode).className, v2.$(f1.parentNode).hasClassName('error'));
    assertTrue(v2.$(f2.parentNode).className, v2.$(f2.parentNode).hasClassName('error'));

    f1.value = val1;
    f2.value = val2;
}

function testDslAnd() {
    v2.dsl.expose();
    var collection = and("field1".is("required"), "field2".is("required"));
    var f1 = v2.$("field1");
    var f2 = v2.$("field2");
    var val1 = f1.value;
    var val2 = f2.value;
    f1.value = '';
    f2.value = '';

    assertFalse(collection.item.test());
    f1.value = 'a';

    assertFalse(collection.item.test());
    f2.value = 'a';

   assertTrue(collection.item.test());

    f1.value = val1;
    f2.value = val2;
}

function testDslOr() {
    v2.dsl.expose();
    var collection = or("field1".is("required"), "field2".is("required"));
    var f1 = v2.$("field1");
    var f2 = v2.$("field2");
    var val1 = f1.value;
    var val2 = f2.value;
    f1.value = '';
    f2.value = '';

    assertFalse(collection.item.test());
    f1.value = 'a';

    assertTrue(collection.item.test());
    f2.value = 'a';

    assertTrue(collection.item.test());

    f1.value = val1;
    f2.value = val2;
}

// This functionality is not added in yet
function __testFieldWhenValid() {
    var field1 = "field1".has("min-length", 5);
    assertFalse('field1 is valid with min-length 5', field1.item.test());

    var field2 = "field2".has("min-length", 6);
    assertFalse('field2 is valid with min-length 6', field2.item.test());

    // Now field1 should only checks its validators when field2 is valid
    field1.whenValid(field2);
    assertTrue('field2 is invalid, and so field1 should pass', field1.item.test());

    v2.$("field2").value = 'Text Text';
    assertFalse('field2 is valid, so field1 should run test and fail', field1.item.test());

    v2.$("field2").value = 'Text';
}

// This functionality is not added in yet
function __testFieldWhenInvalid() {
    var field1 = "field1".has("min-length", 5);
    assertFalse(field1.item.test());

    var field2 = "field2".is("required");
    assertTrue(field2.item.test());

    // Now field1 should only checks its validators when field2 is invalid
    field1.whenInvalid(field2);
    assertTrue(field1.item.test());

    v2.$("field2").value = '';
    assertFalse(field1.item.test());

    v2.$("field2").value = 'Text';
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
          <input type="text" name="field2" id="field2" value="Text" title="This field should be atleast 12 characters!" class="min-length_12" />
        </div>
      </fieldset>
      <fieldset>
        <div class="button" id="nextWrapper"><input type="submit" name="next" value="Next" id="next" /></div>
        <div class="button"><input type="submit" name="prev" value="Previous" id="prev" /></div>
      </fieldset>
    </form>
  </body>
</html>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/2002/REC-xhtml1-20020801/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" dir="ltr" lang="nb-NO">
  <head>
    <title>Test suite for Validatious 2.0 field element</title>
    <?php
        require '../utils/core.php';
        print scripts();
    ?>
    <script type="text/javascript">
function setUp() {

}

function testConstructor() {
    var field = new v2.InputElement(document.getElementById('testEl'), 'blur');
    assertNotUndefined(field.__name);
    assertEquals('blur', field.__events[0]);
    assertEquals(1, field.__elements.length);

    try {
        v2.Interface.ensure(field, v2.FieldElement);
    } catch(e) {
        assertTrue('Field does not implement v2.FieldElement', false);
    }
}

function testGetElementAndIdString() {
    var input = document.getElementById('testEl');
    var testEl = v2.InputElement.get(input);
    assertEquals(v2.InputElement, testEl.constructor);

    var testEl2 = v2.InputElement.get('testEl');
    assertEquals('Fetch object twice does not return same object', testEl, testEl2);
}

function testGetFromBogusName() {
    var testEl = null;

    try {
        testEl = v2.FieldElement.get('bogus');
    } catch(e) {};

    assertNull(testEl);
}

function testGetFromNameString() {
    var fruit = v2.InputElement.get('fruit');
    assertNotNull(fruit);
    assertEquals(3, fruit.__elements.length);
}

function testGetTypes() {
    assertEquals(v2.InputElement, v2.InputElement.get('testEl').constructor);
    assertEquals(v2.TextareaElement, v2.InputElement.get('text').constructor);
    assertEquals(v2.SelectElement, v2.InputElement.get('single').constructor);
    assertEquals(v2.CheckboxElement, v2.InputElement.get('pref1').constructor);
    assertEquals(v2.RadioElement, v2.InputElement.get('fruit').constructor);
}

function testGetLabelFromId() {
    var label = document.getElementById('testElLabel');
    var field = v2.InputElement.get('testEl');
    assertEquals(label, field.getLabel());
}

function testGetLabelFromName() {
    var label = document.getElementById('noIdLabel');
    var field = v2.InputElement.get('noId');
    assertEquals(label, field.getLabel());
}

function testGetSetName() {
    var field = v2.InputElement.get('testEl');
    var label = field.getLabel();
    assertNull(field.__name);
    assertEquals('Label 1', field.getName());

    label.title = 'Field';
    assertEquals('Field', field.getName());

    label.htmlFor = 'bleh';
    assertEquals('testEl', field.getName());

    label.title = '';
    label.htmlFor = 'testEl';

    field.setName('Some field');
    assertEquals('Some field', field.getName());

    field.setName(null);
    assertEquals('Label 1', field.getName());
}

function testGetParent() {
    var apple = v2.InputElement.get('apple');
    assertEquals('fs2', apple.getParent().id);

    var carrot = v2.InputElement.get('carrot');
    assertEquals('fs3', carrot.getParent().id);

    var field = v2.InputElement.get('testEl');
    assertEquals('fs1', field.getParent().id);
}

function testGetElements() {
    assertEquals(1, v2.InputElement.get('testEl').getElements().length);
    assertEquals(2, v2.InputElement.get('vegetable').getElements().length);
    assertEquals(3, v2.InputElement.get('fruit').getElements().length);
}

function testVisible() {
    var field = v2.InputElement.get('testEl');
    assertTrue('Field is invisible from the start', field.visible());

    field.getParent().style.visibility = 'hidden';
    assertFalse('Field visible with parent visibility hidden', field.visible());

    field.getParent().style.visibility = 'visible';
    field.getParent().style.display = 'none';
    assertFalse('Field visible with parent display none', field.visible());

    field.getParent().style.display = 'block';
    field.getElements()[0].style.visibility = 'hidden';
    assertFalse('Field visible with element visibility hidden', field.visible());

    field.getElements()[0].style.visibility = 'visible';
    field.getElements()[0].style.display = 'none';
    assertFalse('Field visible with element display none', field.visible());

    field.getElements()[0].style.display = 'block';
    assertTrue(field.visible());
}

function testValue() {
    assertEquals('testEl value is not Input 1', 'Input 1', v2.InputElement.get('testEl').getValue());
    assertEquals('apple value is not banana', 'banana', v2.InputElement.get('apple').getValue());
    assertEquals('fruit value is not banana', 'banana', v2.InputElement.get('fruit').getValue());
    assertEquals('pref1', v2.InputElement.get('pref1').getValue()[0]);
    assertEquals('pref1', v2.InputElement.get('pref2').getValue()[0]);
    assertEquals('Hidden!', v2.InputElement.get('hidden1').getValue());
    assertEquals('Password!', v2.InputElement.get('pass1').getValue());
    assertEquals('Submit me!', v2.InputElement.get('submit1').getValue());
    assertEquals('A button!', v2.InputElement.get('button1').getValue());
    assertEquals('2', v2.InputElement.get('single').getValue());
    assertEquals('35', v2.InputElement.get('multi').getValue().join(''));
    assertEquals('This is quite the novel', v2.InputElement.get('text').getValue());
}
    </script>
  </head>
  <body>
    <div id="testDiv"></div>
    <form>
      <fieldset id="fs1" class="someClass">
        <label for="testEl" id="testElLabel">Label 1</label>
        <input type="text" name="testEl" id="testEl" value="Input 1" />
        <label for="testEl2" id="testElLabel2">Label 2</label>
        <input type="text" name="testEl2" id="testEl2" value="Input 2" />
      </fieldset>
      <fieldset id="fs2">
        <input type="radio" name="fruit" value="apple" id="apple" />
        <label for="apple">Apple</label>
        <input type="radio" name="fruit" value="orange" id="orange" />
        <label for="orange">Orange</label>
        <input type="radio" name="fruit" value="banana" id="banana" checked="checked" />
        <label for="banana">Banana</label>
      </fieldset>
      <fieldset id="fs3">
        <ul>
          <li>
            <input type="radio" name="vegetable" value="carrot" id="carrot" class="g_test" />
            <label for="carrot">Carrot</label>
          </li>
          <li>
            <input type="radio" name="vegetable" value="cucumber" id="cucumber" class="g_test other" />
            <label for="cucumber">Cucumber</label>
          </li>
        </ul>
      </fieldset>
      <fieldset>
        <input type="checkbox" name="somePref1" value="pref1" id="pref1" class="g_test" checked="checked" />
        <label for="pref1">Preference 1</label>
        <input type="checkbox" name="somePref2" value="pref2" id="pref2" class="g_test" />
        <label for="pref2">Preference 2</label>
        <input type="checkbox" name="somePref3" value="pref3" id="pref3" class="g_other_group" checked="checked" />
        <label for="pref3">Preference 3</label>
      </fieldset>
      <fieldset>
        <input type="checkbox" name="somePref4" value="pref4" id="pref4" class="g_test2" />
        <label for="pref4">Preference 4</label>
        <input type="checkbox" name="somePref5" value="pref5" id="pref5" class="g_test2" />
        <label for="pref5">Preference 5</label>
        <input type="checkbox" name="somePref6" value="pref6" id="pref6" class="g_test2" />
        <label for="pref6">Preference 6</label>
      </fieldset>
      <fieldset>
        <input type="hidden" name="hidden1" id="hidden1" value="Hidden!" />
        <input type="password" name="pass1" id="pass1" value="Password!" />
        <input type="submit" name="submit1" id="submit1" value="Submit me!" />
        <input type="button" name="button1" id="button1" value="A button!" />
      </fieldset>
      <fieldset>
        <select name="single" id="single">
          <option value="">Choose</option>
          <option value="1">First choice</option>
          <option selected="selected" value="2">Second choice</option>
          <option value="3">Third choice</option>
          <option value="4">Fourth choice</option>
          <option value="5">Fifth choice</option>
          <option value="6">Sixth choice</option>
          <option value="7">Seventh choice</option>
        </select>
      </fieldset>
      <fieldset>
        <select name="multi" id="multi" multiple="multiple">
          <option value="">Choose</option>
          <option value="1">First choice</option>
          <option value="2">Second choice</option>
          <option selected="selected" value="3">Third choice</option>
          <option value="4">Fourth choice</option>
          <option selected="selected" value="5">Fifth choice</option>
          <option value="6">Sixth choice</option>
          <option value="7">Seventh choice</option>
        </select>
      </fieldset>
      <fieldset>
        <textarea name="text" id="text">This is quite the novel</textarea>
      </fieldset>
      <fieldset>
        <label for="noId" id="noIdLabel">Test</label>
        <input name="noId" type="text" />
      </fieldset>
    </form>
  </body>
</html>

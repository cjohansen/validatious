<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/2002/REC-xhtml1-20020801/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" dir="ltr" lang="nb-NO">
  <head>
    <title>Test suite for Validatious 2.0 standalone</title>
    <?php
        require '../utils/core.php';
        print scripts();
    ?>
    <script type="text/javascript">
function setUp() {
    v2.$('fs1').className = 'someClass';
}

function testV2ArrayEmptyArray() {
    var data = [];
    var arr = v2.array(data);
    assertEquals(Array, arr.constructor);
    assertEquals(0, arr.length);
    assertEquals(data, arr);
}

function testV2ArrayWithArray() {
    var data = [1, 2, 'a'];
    var arr = v2.array(data);
    assertEquals(Array, arr.constructor);
    assertEquals(3, arr.length);
    assertEquals(data, arr);
}

function testV2ArrayWithString() {
    var data = 'a';
    var arr = v2.array(data);
    assertEquals(Array, arr.constructor);
    assertEquals(1, arr.length);
    assertEquals(data, arr[0]);
}

function testV2ArrayWithNull() {
    var data = null;
    var arr = v2.array(data);
    assertEquals(Array, arr.constructor);
    assertEquals(0, arr.length);
}

function testV2ArrayWithUndefined(data) {
    var arr = v2.array(data);
    assertEquals(Array, arr.constructor);
    assertEquals(0, arr.length);
}

function testEmpty() {
    var undef = {};
    assertTrue(v2.empty(undef.prop));
    assertTrue(v2.empty(null));
    assertTrue(v2.empty(''));
    assertFalse(v2.empty('String'));
}

function testExtendEmptyObject() {
    var obj = {};
    v2.Object.extend(obj, { a: 1, b: 2 });
    assertNotNull(obj.a);
    assertNotNull(obj.b);

    var props = 0;
    for (p in obj) {
        props++;
    }

    assertEquals(2, props);
}

function testExtendObject() {
    var obj = { a: 1, b: 3 };
    v2.Object.extend(obj, { b: 4, c: 5 });
    assertEquals(3, obj.b);
    assertEquals(5, obj.c);

    var props = 0;
    for (p in obj) {
        props++;
    }

    assertEquals(3, props);
}

function testArrayIndexOf() {
    var obj = { testProp: 'unit' };
    var arr = [1, 2, 3, 'a', false, obj, 2];
    assertEquals(1, arr.indexOf(2));
    assertEquals(3, arr.indexOf('a'));
    assertEquals(4, arr.indexOf(false));
    assertEquals(5, arr.indexOf(obj));
}

function testArrayForEach() {
    var obj = { testProp: 'unit' };
    var arr = [1, 2, 3, 'a'];
    var str = '';
    var str2 = '';

    arr.forEach(function(el) { str += el; });
    arr.forEach(function(el) { str2 += el + this.testProp; }, obj);

    assertEquals('123a', str);
    assertEquals('1unit2unit3unitaunit', str2);
}

function testArrayFilter() {
    var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    assertNotNull(arr.filter);
    assertEquals('function', typeof arr.filter);

    var small = arr.filter(function(el) { return el < 6; });
    assertEquals(5, small.length);
    assertEquals(1, small[0]);
    assertEquals(2, small[1]);
    assertEquals(3, small[2]);
    assertEquals(4, small[3]);
    assertEquals(5, small[4]);
}

function testGetWith$() {
    var div = v2.$('testDiv');
    assertNotUndefined(div.observe);
    assertNotUndefined(div.computedStyle);
    assertNotUndefined(div.visible);
    assertEquals('function', typeof div.visible);
}

function testGetWith$$() {
    var label = v2.$$('label[for=testEl]');
    assertNotNull(label[0]);
    assertEquals(document.getElementById('testElLabel'), label[0]);
    assertNull(v2.$$('label[for=someStuff]'));

    var radios = v2.$$('input[type=radio][name=fruit]');
    assertEquals(3, radios.length);
    assertTrue(radios.indexOf(document.getElementById('carrot')) < 0);

    var checkboxes = v2.$$('input[type=checkbox].g_test');
    assertEquals(2, checkboxes.length);
    assertTrue(checkboxes.indexOf(document.getElementById('pref3')) < 0);

    var elements = v2.$$('input[name=testEl], select[name=single]');
    assertEquals(2, elements.length);
    assertEquals('testEl', elements[0].id);
    assertEquals('single', elements[1].id);
}

function testComputedStyle() {
    var div = v2.$('testDiv');
    div.style.background = 'red';
    var color = div.computedStyle('background-color');
    assertTrue('Div background color not red', color == 'rgb(255, 0, 0)' || color == 'red' || color == '#ff0000');
    div.style.height = '100px';
    assertEquals('Div height not 100px', '100px', div.computedStyle('height'));
}

function testVisible() {
    var div = v2.$('testDiv');
    assertTrue('Div not initially visible', div.visible());

    div.style.display = 'none';
    assertFalse('Div visible with display=none', div.visible());

    div.style.display = 'block';
    div.style.visibility = 'hidden';
    assertFalse('Div visible with visibility=hidden', div.visible());

    div.style.visibility = 'visible';
    div.parentNode.style.display = 'none';
    assertFalse('Div visible with body.display=none', div.visible());
}

function testHasClassName() {
    var fs1 = v2.$('fs1');
    assertTrue(v2.Element.hasClassName(fs1, 'someClass'));
    assertFalse(v2.Element.hasClassName(fs1, 'someOtherClass'));
    assertTrue(fs1.hasClassName('someClass'));
}

function testAddClassName() {
    var fs1 = v2.$('fs1');
    assertFalse(v2.Element.hasClassName(fs1, 'someOtherClass'));
    assertEquals(fs1, fs1.addClassName('someOtherClass'));
    assertTrue(fs1.hasClassName('someOtherClass'));
}

function testRemoveClassName() {
    var fs1 = v2.$('fs1');
    fs1.addClassName('someOtherClass');
    assertTrue(fs1.hasClassName('someOtherClass'));
    fs1.removeClassName('someOtherClass');
    assertFalse(fs1.hasClassName('someOtherClass'));
}

function testFunctionBind() {
    var obj = { testStr: 'Object test' };

    var fn = function() {
        return this.testStr;
    };

    assertNotUndefined(fn.bind);
    assertEquals('Object test', fn.bind(obj)());
    assertEquals('Another object test', fn.bind({ testStr: 'Another object test' })());
}

function testFunctionBindCache() {
    var obj = { testStr: 'Objectus testus' };

    var fn = function() {
        return this.testStr;
    };

    // Bind manually twice to assure that manual binding wastes memory
    // by creating new function objects
    var bound = function() { return fn.call(obj); };
    var anotherBound = function() { return fn.call(obj); };
    assertNotEquals(bound, anotherBound);

    // Assure also that the bind method creates even another one
    var boundThroughFunction = fn.bind(obj);
    assertNotEquals(boundThroughFunction, bound);

    // Assert that binding again yields the same object
    assertEquals(boundThroughFunction, fn.bind(obj));

    // The results should be the same though
    assertEquals(boundThroughFunction(), bound());
}
/*
function testFormValues() {
    assertEquals('Input 1', v2.FormUtil.value(document.getElementById('testEl')));
    assertEquals('banana', v2.FormUtil.value(document.getElementById('apple')));
    assertEquals('banana', v2.FormUtil.value(document.getElementById('banana')));
    assertNull(v2.FormUtil.value(document.getElementById('carrot')));
    assertEquals('pref1', v2.FormUtil.value(document.getElementById('pref1'))[0]);
    assertEquals('pref1', v2.FormUtil.value(document.getElementById('pref2'))[0]);
    assertNull(v2.FormUtil.value(document.getElementById('pref4')));
    assertEquals('Hidden!', v2.FormUtil.value(document.getElementById('hidden1')));
    assertEquals('Password!', v2.FormUtil.value(document.getElementById('pass1')));
    assertEquals('Submit me!', v2.FormUtil.value(document.getElementById('submit1')));
    assertEquals('A button!', v2.FormUtil.value(document.getElementById('button1')));
    assertEquals('2', v2.FormUtil.value(document.getElementById('single')));
    assertEquals('35', v2.FormUtil.value(document.getElementById('multi')).join(''));
    assertEquals('This is quite the novel', v2.FormUtil.value(document.getElementById('text')));
}*/
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
      <fieldset>
        <input type="radio" name="vegetable" value="carrot" id="carrot" class="g_test" />
        <label for="carrot">Carrot</label>
        <input type="radio" name="vegetable" value="cucumber" id="cucumber" class="g_test other" />
        <label for="cucumber">Cucumber</label>
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
    </form>
  </body>
</html>
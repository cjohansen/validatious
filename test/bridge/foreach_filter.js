/*function testArrayForEach() {
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
}*/
/*function testRemoveObject() {
    var cfi = new v2.CompositeFormItem();
    var cfi2 = new v2.CompositeFormItem();
    assertEquals(0, cfi.__validators.length);

    cfi.add(cfi);
    cfi.add(cfi2);
    assertEquals(2, cfi.__validators.length);

    cfi.remove(cfi);
    assertEquals(1, cfi.__validators.length);
}

function testRemoveIndex() {
    var cfi = new v2.CompositeFormItem();
    var cfi2 = new v2.CompositeFormItem();
    assertEquals(0, cfi.__validators.length);

    cfi.add(cfi);
    cfi.add(cfi2);
    assertEquals(2, cfi.__validators.length);

    cfi.remove(0);
    assertEquals(1, cfi.__validators.length);
    assertEquals(cfi2, cfi.__validators[0]);
}*/
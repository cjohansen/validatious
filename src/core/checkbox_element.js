/**
 * Checkbox input controls
 *
 * @implements v2.FieldElement
 */
v2.CheckboxElement = v2.RadioElement.extend(/** @scope v2.CheckboxElement.prototype */{

  /**
   * @see v2.RadioElement.getValue
   * @return {Array} Value attribute of every selected checkbox
   */
  getValue: function() {
    var values = [], i, checkbox;

    for (i = 0, checkbox; (checkbox = this.__elements[i]); i++) {
      if (checkbox.checked) {
        values.push(checkbox.value);
      }
    }

    return values;
  }
});

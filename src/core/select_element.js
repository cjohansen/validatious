/**
 * Input controls based on select boxes
 *
 * @implements v2.FieldElement
 * @depends input_element.js
 */
v2.SelectElement = v2.InputElement.extend(/** @scope v2.SelectElement.prototype */{

  /**
   * Construct a new select field
   * @see v2.FieldElement.constructor
   */
  constructor: function(select) {
    // Regular initialization, add select specific event
    this.base([select], 'change');
  },

  /**
   * @see v2.FieldElement.getValue
   *
   * Returns the value attribute of the currently selected option. For multi
   * selects, it returns an array of value attributes for each selected option.
   */
  getValue: function() {
    var select = this.__elements[0];

    if (!select.multiple) {
      return select.options.length > 0 && select.options[select.selectedIndex].value;
    }

    var values = [];

    for (var i = 0, option; (option = select.options[i]); i++) {
      if (option.selected) {
        values.push(option.value);
      }
    }

    return values;
  }
});

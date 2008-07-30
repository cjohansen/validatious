/**
 * Fields based on select boxes
 *
 * @implements v2.Composite
 * @implements v2.FormItem
 * @implements v2.FieldElement
 */
v2.SelectElement = v2.Field.extend(/** @scope v2.SelectElement.prototype */{

  /**
   * Construct a new select field
   * @see v2.Field.constructor
   */
  constructor: function(select, instant, instantWhenValidated) {
    // Regular initialization
    this.base(select, instant, instantWhenValidated);

    // Add select specific event
    this.__events.push('change');
  },

  /**
   * @see v2.FieldElement.getValue
   *
   * Returns the value attribute of the currently selected option. For multi
   * selects, it returns an array of value attributes for each selected option.
   */
  getValue: function() {
    var select = this.__elements[0];

    if (select.multiple) {
      return select.options[select.selectedIndex].value;
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

/**
 * Textarea input control
 *
 * @implements v2.FieldElement
 */
v2.TextareaElement = v2.InputElement.extend(/** @scope v2.TextareaElement.prototype */{

  /**
   * @see v2.FieldElement.getValue
   *
   * Returns the innerHTML of the textarea
   */
  getValue: function() {
    return this.__elements[0].innerHTML;
  }
});

/**
 * Radio button fields with validation logic
 *
 * @implements v2.Composite
 * @implements v2.FormItem
 * @implements v2.FieldElement
 */
v2.RadioElement = v2.InputElement.extend(/** @scope v2.RadioElement.prototype */{
  /**
   * Construct a new radio field
   * @see v2.InputElement.constructor
   */
  constructor: function(elements) {
    // Regular initialization, override events
    this.base(elements, ['click', 'change']);
  },

  /**
   * @see v2.FieldElement.getValue
   *
   * Returns the value attribute of the currently selected radio button
   */
  getValue: function() {
    for (var i = 0, radio; (radio = this.__elements[i]); i++) {
      if (radio.checked) {
        return radio.value;
      }
    }

    return null;
  },

  /**
   * @see v2.FieldElement.getLabel
   *
   * A radio button field is assumed to be either a list - ordered or unordered -
   * with some element in front that acts as a label. This may be any element.
   *
   * If it is not in a list (ie the element does not have <li> parent elements),
   * the label is assumed to be the element before the first input element.
   *
   * Example (list approach):
   *
   *   <h2>Favourite food:</h2>
   *   <ul>
   *     <li>
   *       <input type="radio" name="food" value="hamburger" id="food_hamburger" />
   *       <label for="food_hamburger">Haburger</label>
   *     </li>
   *     <li>
   *       <input type="radio" name="food" value="pizza" id="food_pizza" />
   *       <label for="food_pizza">Pizza</label>
   *     </li>
   *   </ul>
   *
   * getLabel() will in this case return the h2 element.
   *
   * Example (no list).
   *
   *   <label class="groupLabel">Favourite food:</label>
   *   <input type="radio" name="food" value="hamburger" id="food_hamburger" />
   *   <label for="food_hamburger">Haburger</label>
   *   <input type="radio" name="food" value="pizza" id="food_pizza" />
   *   <label for="food_pizza">Pizza</label>
   *
   * getLabel() will in this case return the first label element
   */
  getLabel: function() {
    var parent = this.__elements[0].parentNode;

    if (parent.tagName.toLowerCase() === 'li') {
      return parent.parentNode.previousSibling;
    }

    return this.__elements[0].previousSibling;
  },

  /**
   * @see v2.FieldElement.getParent
   * @return the parent node unless it's an li element. If it is, the list
   *         elements parent is returned
   */
  getParent: function() {
    var parent = this.__elements[0].parentNode;

    return parent.tagName.toLowerCase() === 'li' ? parent.parentNode.parentNode : parent;
  }
});

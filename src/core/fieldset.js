/**
 * Fieldsets (collections, could be divs or anything else too) with validation
 * logic. Provides a hook to add onFailure and onSuccess callbacks to form
 * blocks, but no other special functionality.
 *
 * @implements v2.Composite
 * @implements v2.FormItem
 */
v2.Fieldset = v2.CompositeFormItem.extend(/** @scope v2.Fieldset.prototype */{
  type: 'fieldset', // Makes for easier typechecking

  /**
   * Construct a new fieldset with validation logic
   *
   * @param {Element} element The parent block element
   */
  constructor: function(element) {
    // Regular initialization
    this.base();
    this.element = element;
  },

  /**
   * Returns the parent element for the field
   */
  getParent: function() {
    return this.element.parentNode;
  }
});

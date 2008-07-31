/**
 * Fields with validation logic
 *
 * @implements v2.Composite
 * @implements v2.FormItem
 */
v2.Field = v2.CompositeFormItem.extend(/** @scope v2.Field.prototype */{
  instant: false,             // If validations should be run instantly
  instantWhenValidated: true, // If validations should be run instantly after
                              // the validation has been run once
  validateHidden: false,      // If a field should be validated even if it's not
                              // visible
  displayErrors: -1,          // How many error messages to display per field
                              // Default is -1 = all messages
  positionErrorsAbove: true,  // Whether to display error messages above field
                              // (true - default) or below field (false)
  failureClass: 'error',      // Class name to append to fields parent element
                              // when validation fails
  successClass: '',           // Class name to append to fields parent element
                              // when validation succeeds

  /**
   * Construct a new field with validation logic
   *
   * @param {v2.FieldElement} element The element to add validation for
   * @param {boolean}         instant
   * @param {boolean}         instantWhenValidated
   */
  constructor: function(element, instant, instantWhenValidated) {
    // Regular initialization
    this.base();

    // Initialize properties
    this.__monitored = false;
    this.__element = v2.InputElement.get(element);
    this.instant = typeof instant !== 'undefined' ? instant : this.instant;
    this.instantWhenValidated = typeof instantWhenValidated !== 'undefined' ? instantWhenValidated : this.instantWhenValidated;

    // Monitor if field is "instant"
    this.__monitor(this.instant);
  },

  /**
   * Checks that a field is valid. If the validateHidden boolean is set to true,
   * the method returns true if the field is visible.
   */
  test: function() {
    // Return true if we should not validate hidden fields, and field is hidden
    if (!this.validateHidden && !this.__element.visible()) {
      return true;
    }

    return this.base();
  },

  /**
   * Validate field. Also starts monitoring the field if it is configured to be
   * "instantWhenValidated"
   */
  validate: function() {
    this.__monitor(this.instantWhenValidated && !this.__monitored);
    return this.base();
  },

  /**
   * Private method: monitor field. Gives immediate respons on whether or not a
   * field is valid by adding the validate method as a listener to element
   * appropriate events.
   *
   * @param {boolean} condition a condition to meet before monitoring
   */
  __monitor: function(condition) {
    if (!condition || this.__monitored) {
      return;
    }

    this.__monitored = true;
    this.__element.monitor(this.validate.bind(this));
  }
});

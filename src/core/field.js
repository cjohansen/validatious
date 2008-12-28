/**
 * Fields with validation logic
 *
 * @implements v2.Composite
 * @implements v2.FormItem
 * @depends composite_form_item.js
 * @depends input_element.js
 */
v2.Field = v2.CompositeFormItem.extend(/** @scope v2.Field.prototype */{
  validateHidden: false,      // If a field should be validated even if it's not
                              // visible
  instant: false,             // If validations should be run instantly
  instantWhenValidated: true, // If validations should be run instantly after
                              // the validation has been run once
  type: 'field',              // Identifier, makes for easier type checking

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
    this.element = v2.$f(element);
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
    if (!this.validateHidden && !this.element.visible()) {
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
   * Adds a field validator to this field
   *
   * @param {String} name    The name of the validator
   * @param {Array}  params  Parameters for the field validator
   * @param {String} message Custom error message for this validation
   */
  addValidator: function(name, params, message) {
    var validator = v2.$v(name);

    if (validator === null) {
      throw new Error(name + ' is not a valid validator');
    }

    if (typeof message !== 'undefined' && message !== null) {
      message = new v2.Message(message, validator.getMessage().params);
    }

    var fv = new v2.FieldValidator(this.element, validator, v2.array(params), message);
    this.add(fv);

    return fv;
  },

  /**
   * Returns the parent element for the field
   */
  getParent: function() {
    return this.element.getParent();
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
    var obj = this.parent && this.parent.type === 'fieldset' ? this.parent : this;
    var validate = obj.validate.bind(this);

    this.element.monitor(function(e) {
        validate(e);
    });
  }
});

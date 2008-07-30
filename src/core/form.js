/**
 * Forms with validation logic. Implements the v2.Composite and v2.FormItem
 * interfaces.
 */
v2.Form = v2.CompositeFormItem.extend(/** @scope v2.Form.prototype */{
  /**
   * Construct new form with validation logic.
   *
   * @param {Object} form Either a string id or a form element
   */
  constructor: function(form) {
    // Superclass constructor
    this.base();
    this.__form = v2.$(form);
    this.__form.observe('submit', this.validate.bind(this));
    this.__buttons = [];
  },

  /**
   * Add a button that should trigger validation. If no buttons are added, all
   * buttons will trigger validation. If a single button is added, every button
   * that should trigger validation must be explicitly added.
   *
   * @param {InputElement} button An input element
   */
  addButton: function(input) {
    this.__buttons.push(input);
  },

  /**
   * Validates a form. If the event parameter is provided it will check that the
   * button is supposed to trigger validation, and it will prevent the submit
   * if the validation is unsuccessful.
   *
   * @param {Event} e Event object, optional
   */
  validate: function() {
    var event = arguments.length > 0 ? arguments[0] : null;
    var target = v2.target(event);
    var buttons = this.__buttons;

    if (buttons.length > 0 && target && buttons.indexOf(target) < 0) {
      return true;
    }

    var valid = this.base();

    if (!valid && event) {
      event.preventDefault();
      event.returnValue = false;
    }

    return valid;
  }
});

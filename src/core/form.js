/**
 * Forms with validation logic. Implements the v2.Composite and v2.FormItem
 * interfaces.
 *
 * @depends composite_form_item.js
 */
v2.Form = v2.CompositeFormItem.extend(/** @scope v2.Form.prototype */{
  type: 'form', // Eases type checking

  /**
   * Construct new form with validation logic.
   *
   * @param {Object} form Either a string id or a form element
   */
  constructor: function(form) {
    // Superclass constructor
    this.base();

    if (form) {
      this.__form = v2.$(form);
      this.__form.observe('submit', this.validate.bind(this));
    }

    this.__buttons = [];
    this.__activeButton = null;
  },

  /**
   * Add a button that should trigger validation. If no buttons are added, all
   * buttons will trigger validation. If a single button is added, every button
   * that should trigger validation must be explicitly added.
   *
   * @param {InputElement} button An input element
   */
  addButton: function(button) {
    this.__buttons.push(button);

    v2.Element.observe(button, 'click', (function(e) {
      this.__activeButton = button;
    }).bind(this));
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
    var buttons = this.__buttons;
    var button = this.__activeButton;
    this.__activeButton = null;

    if (buttons.length > 0 &&
        buttons.indexOf(button) < 0) {
      return true;
    }

    var valid = this.base();

    if (!valid && event) {
      event.preventDefault();
      event.returnValue = false;
    }

    return valid;
  }
}, /** @scope v2.Form */{
  forms: {},

  /**
   * Get instance for HTML form element or string representing a form element id
   *
   * @param {Object} idORElement
   */
  get: function(idOrElement) {
    var element = v2.$(idOrElement), instance;

    if (element === null || element.tagName.toLowerCase() !== 'form') {
      throw new ArgumentError('idOrElement should represent a form element');
    }

    if (!v2.empty(instance = v2.Form.forms[element.id])) {
      return instance;
    }

    return (v2.Form.forms[element.id] = new v2.Form(element));
  }
});

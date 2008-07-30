/**
 * Fields with validation logic
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
   * @param {Object} idNameEl
   * @param {boolean} instant
   * @param {boolean} iwv
   */
  constructor: function(idNameEl, instant, instantWhenValidated) {
    this.base();
    var el = v2.$(idNameEl);
    this.__elements = el === null ? v2.$$('input[name=' + idNameEl + ']') : [el];
    this.instant = !!instant ? instant : this.instant;
    this.instantWhenValidated = !!instantWhenValidated ? instantWhenValidated : this.instantWhenValidated;
    this.__monitored = false;

    if (this.instant) {
      this.__monitor();
    }
  },

  /**
   * Checks that a field is valid.
   */
  test: function() {
    // Return true if we should not validate hidden fields, and field is hidden
    if (!this.validateHidden && !this.field.visible()) {
      return true;
    }

    return this.base();
  },

  /**
   * Validate field
   */
  validate: function() {
    if (this.instantWhenValidated && !this.__monitored) {
      this.__monitor();
    }

    return this.base();
  },

  /**
   * Private method: monitor field. Gives immediate respons on whether or not a
   * field is valid
   */
  __monitor: function() {
/*    if (this._monitored) {
      return;
    }

    this._monitored = true;
    var field = this.field;
    var tagName = field.tagName.toLowerCase();
    var events = ['blur'];
    var elements = [field];

    if (field.type && (field.type == 'radio' || field.type == 'checkbox')) {
      events = ['click', 'change'];
      elements = field.type == 'radio' ?
        v2.$$('input[type=radio][name=' + field.name + ']', field.form) :
        v2.$$('input[type=checkbox].g_' + field.className.match(/\bg_([^\s]*)\b/)[1], field.form);
      elements = elements.length == 0 ? [field] : elements;
    } else if (typeof field.options != 'undefined') {
      events = ['change'];
    }

    for (var i = 0; i < elements.length; i++) {
      for (var j = 0; j < events.length; j++) {
        v2.Element.observe(elements[i], events[j], this.validate.bind(this));
      }
    }*/
  }
});

/**
 * Fields with validation logic
 *
 * @implements v2.Composite
 * @implements v2.FormItem
 * @implements v2.FieldElement
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
   * @param {Array}   elements The elements that make up this field. May be a
   *                           single object instead of an array
   * @param {boolean} instant
   * @param {boolean} instantWhenValidated
   * @param {Array}   events   The type of "instant" events the elements support
   */
  constructor: function(elements, instant, instantWhenValidated, events) {
    // Regular initialization
    this.base();

    // Initialize properties
    this.__monitored = false;
    this.__name = null;
    this.__events = v2.empty(events) ? ['blur'] : v2.array(events);
    this.__elements = v2.array(elements);
    this.instant = typeof instant !== 'undefined' ? instant : this.instant;
    this.instantWhenValidated = typeof instantWhenValidated !== 'undefined' ? instantWhenValidated : this.instantWhenValidated;

    // Monitor if field is "instant"
    if (this.instant) {
      this.__monitor();
    }
  },

  /**
   * Checks that a field is valid. If the validateHidden boolean is set to true,
   * the method returns true if the field is visible.
   */
  test: function() {
    // Return true if we should not validate hidden fields, and field is hidden
    if (!this.validateHidden && !this.visible()) {
      return true;
    }

    return this.base();
  },

  /**
   * Validate field. Also starts monitoring the field if it is configured to be
   * "instantWhenValidated"
   */
  validate: function() {
    if (this.instantWhenValidated && !this.__monitored) {
      this.__monitor();
    }

    return this.base();
  },

  /**
   * Private method: monitor field. Gives immediate respons on whether or not a
   * field is valid by adding the validate method as a listener to element
   * appropriate events.
   */
  __monitor: function() {
    if (this.__monitored) {
      return;
    }

    this.__monitored = true;
    var i, j, element, event;

    for (i = 0; (element = this.__elements[i]); i++) {
      for (j = 0; (event = events[i]); j++) {
        v2.Element.observe(element, event, this.validate.bind(this));
      }
    }
  },

  /**
   ** v2.FieldElement implementation
   **/

  /**
   * @see v2.FieldElement.getValue
   *
   * Default implementation returns the value attribute of the first element.
   */
  getValue: function() {
    if (this.__elements.length === 0) {
      return this.__elements[0].value;
    }
  },

  /**
   * @see v2.FieldElement.getLabel
   *
   * Default implementation looks up the label that is linked to the first
   * element through the for/id attributes
   */
  getLabel: function() {
    var el = this.__elements[0];
    var label = v2.$$('label[for=' + (el.id || el.name) + ']', el.form);

    return label && label[0];
  },

  /**
   * @see v2.FieldElement.getName
   */
  getName: function() {
    if (this.__name) {
      return this.__name;
    }

    var label = this.getLabel();

    if (label) {
      return label.title !== '' ? label.title : label.innerHTML;
    }

    var el = this.__elements[0];
    return el.id || el.name;
  },

  /**
   * @see v2.FieldElement.setName
   */
  setName: function(name) {
    this.__name = !!name ? name : null;

    return this;
  },

  /**
   * @see v2.FieldElement.getParent
   */
  getParent: function() {
    return this.__elements[0].parentNode;
  },

  /**
   * @see v2.FieldElement.getElements
   */
  getElements: function() {
    return this.__elements;
  },

  /**
   * @see v2.FieldElement.visible
   */
  visible: function() {
    if (!v2.$(this.getParent()).visible()) {
      return false;
    }

    for (var i = 0, el; (el = this.__elements[i]); i++) {
      if (v2.Element.visible(el)) {
        return true;
      }
    }

    return false;
  }
}, /** @scope v2.Field */{
  __fields: {},

  /**
   * Factory method for creating and retriving field objects. Only one field
   * instance is needed per actual form field. The factory method never
   * recreates a previously created object, and it simplifies the task of
   * choosing obejct type.
   *
   * @param {Object} idNameEl The parameter may be one of three things:
   *                          1) String: id of an element. For multi option
   *                             controls, this may be the id of one element
   *                             in the collection.
   *                          2) String: name of an element. Same rules as for
   *                             id parameter.
   *                          3) Element: a single element in the collection (or
   *                             the actual only one). Same rules as for id.
   * @param {boolean} instant
   * @param {boolean} instantWhenValidated
   * @return {v2.Field} a field object
   */
  get: function(idNameEl, instant, instantWhenValidated) {
    var element = v2.$(idNameEl), id, field, elements, selector;

    // Argument was name string
    if (!element) {
      selector = 'input$, select$, textarea$';
      elements = v2.$$(selector.replace('$', '[name=' + idNameEl + ']'));
      element = elements[0];
    }

    // Invalid element argument
    if (!element) {
      throw new ArgumentError(idNameEl + ' does not resolve to an HTML element!');
    }

    // Look up element field object - prefer name over id as identifier since it
    // will return the same element for all radio buttons (common name but
    // individual ids)
    id = element.name || element.id;

    if ((field = v2.Field.__fields[id])) {
      return field;
    }

    // Create new object of the right type
    if (element.options) {
      // Select boxes
      field = new v2.SelectElement(element, instant, instantWhenValidated);
    } else if (element.tagName.toLowerCase() === 'textarea') {
      // Textareas
      field = new v2.TextareaElement(element, instant, instantWhenValidated);
    } else if (element.type && element.type == 'radio') {
      // Radio buttons
      elements = v2.$$('input[type=radio][name=' + element.name + ']', element.form);
      field = new v2.RadioElement(elements, instant, instantWhenValidated);
    } else if (element.type && element.type == 'checkbox') {
      // Checkboxes
      elements = v2.$$('input[type=checkbox].g_' + element.className.match(/\bg_([^\s]*)\b/)[1], element.form);
      field = new v2.CheckboxElement(elements, instant, instantWhenValidated);
    } else {
      // Input elements (text inputs)
      field = new v2.Field(element, instant, instantWhenValidated);
    }

    return (v2.Field.__fields[field.name || field.id] = field);
  }
});

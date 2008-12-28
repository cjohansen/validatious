/**
 * Generic input control
 *
 * @implements v2.FieldElement
 * @depends composite_form_item.js
 */
v2.InputElement = Base.extend(/** @scope v2.InputElement.prototype */{

  /**
   * Construct a new input control
   *
   * @param {Array} elements The elements that make up this control. May be a
   *                         single object instead of an array
   * @param {Array} events   The type of "instant" events the elements support
   */
  constructor: function(elements, events) {
    // Initialize properties
    this.__name = null;
    this.__events = v2.empty(events) ? ['blur'] : v2.array(events);
    this.__elements = v2.array(elements);
  },

  /**
   * Monitor field with a function.
   *
   * @param {Function} eventHandler
   */
  monitor: function(eventHandler) {
    this.__monitored = true;
    var i, j, element, event;

    for (i = 0; (element = this.__elements[i]); i++) {
      for (j = 0; (event = this.__events[j]); j++) {
        v2.Element.observe(element, event, eventHandler);
      }
    }
  },

  /**
   * @see v2.FieldElement.getValue
   *
   * Default implementation returns the value attribute of the first element.
   */
  getValue: function() {
    return this.__elements[0].value;
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
}, /** @scope v2.InputElement */{
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
   * @return {v2.Field} a field object
   */
  get: function(idNameEl) {
    if (idNameEl && idNameEl.constructor === v2.InputElement) {
      return idNameEl;
    }

    var element = v2.$(idNameEl), id, field, elements, selector, className, pattern;

    // Argument was name string
    if (!element) {
      selector = 'input$, select$, textarea$';
      elements = v2.$$(selector.replace(/\$/g, '[name=' + idNameEl + ']'));
      element = elements[0];
    }

    // Invalid element argument
    if (!element) {
      throw new TypeError(idNameEl + ' does not resolve to an HTML element!');
    }

    // Look up element field object - prefer name over id as identifier since it
    // will return the same element for all radio buttons (common name but
    // individual ids)
    id = element.name || element.id;

    if ((field = v2.InputElement.__fields[id])) {
      return field;
    }

    // Create new object of the right type
    if (element.options) {
      // Select boxes
      field = new v2.SelectElement(element);
    } else if (element.tagName.toLowerCase() === 'textarea') {
      // Textareas
      field = new v2.TextareaElement(element);
    } else if (element.type && element.type == 'radio') {
      // Radio buttons
      elements = v2.$$('input[type=radio][name=' + element.name + ']', element.form);
      field = new v2.RadioElement(elements);
    } else if (element.type && element.type == 'checkbox') {
      // Checkboxes
      className = element.className;
      pattern = /\bg_([^\s]*)\b/;
      elements = pattern.test(className) ? v2.$$('input[type=checkbox].g_' + className.match(pattern)[1], element.form) : [element];
      field = new v2.CheckboxElement(elements);
    } else {
      // Input elements (text inputs)
      field = new v2.InputElement(element);
    }

    return (v2.InputElement.__fields[id] = field);
  }
});

/**
 * Alias/shorthand for v2.InputElement.get
 */
v2.$f = v2.InputElement.get;

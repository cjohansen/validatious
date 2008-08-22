/**
 * Error reporting features as a mixin. Add to components with
 * v2.Object.extend(myKlass, v2.ErrorReporting)
 */
v2.ErrorReporting = {
  displayErrors: -1,          // How many error messages to display per item
                              // Default is -1 = all messages
  positionErrorsAbove: true,  // Whether to display error messages above item
                              // (true - default) or below (false)
  failureClass: 'error',      // Class name to append to the parent element
                              // when validation fails
  successClass: '',           // Class name to append to the parent element
                              // when validation succeeds

  /**
   * Callback that's called when validation on the component fails. If the
   * parent component is a fieldset then the method is immediately aborted.
   */
  onFailure: function() {
    if (this.parent && this.parent.type === 'fieldset') {
      return;
    }

    var parent = this.onSuccess();
    var str = '', i, error, validation, listElement;
    var used = [];
    var messages = this.getMessages();

    parent.addClassName(this.failureClass);
    parent.removeClassName(this.successClass);

    var list = document.createElement('ul');
    list.id = this.__getId();
    list.className = 'messages';

    // Set number of errors to display. -1 is all, maximum is all
    var count = this.displayErrors;
    var max = this.__errors.length;
    count = count < 0 || count > max ? max : count;

    for (i = 0; i < count; i++) {
      error = messages[i];

      // Filter out duplicate error messages
      if (!error || used.indexOf(error.toString()) >= 0) {
        continue;
      }

      used.push(error.toString());
      listElement = document.createElement('li');
      listElement.innerHTML = error.toString();
      list.appendChild(listElement);
    }

    if (this.positionErrorsAbove) {
      parent.insertBefore(list, parent.firstChild);
    } else {
      parent.appendChild(list);
    }
  },

  /**
   * Callback that's called when validation succeeds
   */
  onSuccess: function() {
    if (this.parent && this.parent.type === 'fieldset') {
      return null;
    }

    var parent = this.getParent();

    // Remove error if it exists
    var list = v2.$(this.__getId());

    if (list && parent === list.parentNode) {
      parent.removeChild(list);
    }

    parent.removeClassName(this.failureClass);
    parent.addClassName(this.successClass);

    return parent;
  },

  /**
   * Creates an ID string for error lists
   */
  __getId: function() {
    var input = this.element.getElements ? this.element.getElements()[0] : null;
    var parent = input || this.getParent();
    return (parent.id || parent.name || parent.className) + '_error';
  }
};

/**
 * Add error reporting features to field and fieldset types
 */
v2.Object.extend(v2.Field.prototype, v2.ErrorReporting);
v2.Object.extend(v2.Fieldset.prototype, v2.ErrorReporting);

/**
 * Adds error reporting to forms.
 */
v2.Object.extend(v2.Form.prototype, /** @scope v2.Form.prototype */{
  /**
   * Scroll to first element with class name containing
   * v2.Field.prototype.failureClass
   */
  onFailure: function() {
    var errors = this.getInvalid();

    for (var i = 0, component; (component = errors[i]); i++) {
      if (component.getParent) {
        v2.$(component.getParent()).scrollTo();
        return;
      }
    }
  }
});

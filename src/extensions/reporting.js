/**
 * Extension to the v2.Field objects that provide a fairly flexible error
 * reporting system for fields.
 */
v2.Field = v2.Object.extend(/** @scope stb.Field.prototype */{
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
   * Callback that's called when validation on the field fails
   */
  onFailure: function() {
    var parent = this.onSuccess();
    var str = '', i, error, validation, listElement;
    var used = [];
    var input = this.field.getElements()[0];
    var messages = this.getMessages();

    parent.addClassName(this.failureClass);
    parent.removeClassName(this.successClass);

    var list = document.createElement('ul');
    list.id = (input.id || input.name) + '_errors';
    list.className = 'messages';

    // Set number of errors to display. -1 is all, maximum is all
    var count = this.displayErrors;
    var max = this.__errors.length;
    count = count < 0 || count > max ? max : count;

    for (i = 0; i < count; i++) {
      error = messages[i];

      // Filter out duplicate error messages
      if (used.indexOf(error.toString()) >= 0) {
        continue;
      }

      used.push(err.toString());
      listElement = document.createElement('li');
      listElement.innerHTML = error.toString();
      list.appendChild(listElement);
    }

    parent.scrollTo();

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
    var parent = this.field.getParent();
    var input = this.field.getElements()[0];

    // Remove error if it exists
    var list = v2.$((input.id || input.name) + '_errors');

    if (list !== null && parent === list.parentNode) {
      parent.removeChild(list);
    }

    parent.removeClassName(this.failureClass);
    parent.addClassName(this.successClass);

    return parent;
  }
});

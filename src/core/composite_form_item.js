/**
 * Implements v2.Composite and v2.FormItem
 *
 * The composite interface is implemented using the private array __validators.
 *
 * The form item interface is implemented using the private array __errors.
 *
 * The private boolean __passOnAny is used to serve the passOnAny() method. It's
 * default value is false.
 */
v2.CompositeFormItem = Base.extend(/** @scope v2.CompositeFormItem.prototype */{
  type: 'generic', // Makes for easier type checking

  /**
   * Sets up the __validators and __errors arrays if they do'nt already exist
   */
  constructor: function() {
    if (v2.empty(this.__validators)) {
      this.__validators = [];
    }

    if (v2.empty(this.__errors)) {
      this.__errors = [];
    }

    this.__passOnAny = false;
    this.__message = null;

    this.parent = null;

    /* Exceptions
    this.__exceptions = [];
    this.__exceptionFlags = [];*/
  },

  /**
   * @see v2.Composite.add
   *
   * @param {Object} obj An object that implements v2.Composite and v2.FormItem
   */
  add: function(obj) {
    //v2.Interface.ensure(obj, [v2.Composite, v2.FormItem]);
    this.__validators.push(obj);
    obj.parent = this;
  },

  /*
   * @see v2.Composite.remove
   *
   * @param {mixed} obj Either an integer giving the index to delete or an
   *                    object to search for and delete
   *
  remove: function(obj) {
    if (typeof obj === 'number' && obj < this.__validators.length) {
      obj = this.__validators[obj];
    }

    if (typeof obj === 'object') {
      this.__validators = this.__validators.filter(function(element) {
        return element !== obj;
      });
    }
  },*/

  /**
   * @see v2.Composite.get
   *
   * @param {int} i Index to fetch, if undefined the whole collection is returned
   */
  get: function(i) {
    return !v2.empty(i) ? this.__validators[i] : this.__validators;
  },

  /**
   * @see v2.FormItem.validate
   */
  validate: function() {
    this.__errors = [];
    var valid = this.test('validate');

    if (valid) {
      // OR-validations may cause errors even though the component passes
      // Clear errors when component is valid
      this.__errors = [];
      this.onSuccess();
    } else {
      this.onFailure();
    }

    return valid;
  },

  /**
   * @see v2.FormItem.test
   */
  test: function(fn) {
    /*if (this.__passExceptions()) {
      return true;
    }*/

    var i, validator, valid = 0;
    fn = fn || 'test';

    for (i = 0; (validator = this.__validators[i]); i++) {
      if (validator[fn]()) {
        valid++;
      } else {
        this.__errors.push(validator);
      }
    }

    return this.passOnAny() && valid > 0 ||
           !this.passOnAny() && valid === this.__validators.length;
  },

  /**
   * @see v2.FormItem.getInvalid
   */
  getInvalid: function() {
    return this.__errors.length === 0 ? null : this.__errors;
  },

  /**
   * @see v2.FormItem.setMessage
   *
   * @param {v2.Message} message
   */
  setMessage: function(message) {
    this.__message = message;
  },

  /**
   * @see v2.FormItem.getMessages
   */
  getMessages: function() {
    if (!v2.empty(this.__message)) {
      return [this.__message];
    }

    var messages = [], i, validator;

    for (i = 0, validator; (validator = this.__errors[i]); i++) {
      messages = messages.concat(validator.getMessages());
    }

    return messages;
  },

  /**
   * @see v2.FormItem.passOnAny
   */
  passOnAny: function(value) {
    if (typeof value !== 'undefined') {
      this.__passOnAny = !!value;
    }

    return this.__passOnAny;
  },

  /**
   * @see v2.FormItem.onSuccess
   *
   * Does nothing
   */
  onSuccess: function() {},

  /**
   * @see v2.FormItem.onFailure
   *
   * Does nothing
   */
  onFailure: function() {}/*,

  /*
   * Add a component to depend on. When validating
   *
   * @param {v2.CompositeFormItem} cfi The component to depend on
   * @param {boolean} flag If true the component must pass, otherwise it must
   *                       fail. Default value is true
   *
  addException: function(cfi, flag) {
    this.__exceptions.push(cfi);
    this.__exceptionFlags.push(typeof flag === 'undefined' ? true : flag);
  },

  /*
   * Checks that all dependencies pass (or fails, depending on the flag value)
   *
  __passExceptions: function() {
    if (this.__exceptions.length === 0) {
      return false;
    }

    for (var i = 0, component; (component = this.__exceptions[i]); i++) {
      if (!(component.test() && this.__exceptionFlags[i])) {
        return false;
      }
    }

    return true;
  }*/
});

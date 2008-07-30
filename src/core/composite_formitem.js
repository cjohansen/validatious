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
  },

  /**
   * @see v2.Composite.add
   *
   * @param {Object} obj An object that implements v2.Composite and v2.FormItem
   */
  add: function(obj) {
    v2.Interface.ensure(obj, [v2.Composite, v2.FormItem]);
    this.__validators.push(obj);
  },

  /**
   * @see v2.Composite.remove
   *
   * @param {mixed} obj Either an integer giving the index to delete or an
   *                    object to search for and delete
   */
  remove: function(obj) {
    if (typeof obj === 'number' && obj < this.__validators.length) {
      obj = this.__validators[obj];
    }

    if (typeof obj === 'object') {
      this.__validators = this.__validators.filter(function(element) {
        return element !== obj;
      });
    }
  },

  /**
   * @see v2.Composite.get
   *
   * @param {int} Index to fetch
   */
  get: function(i) {
    return this.__validators(i);
  },

  /**
   * @see v2.FormItem.validate
   */
  validate: function() {
    var valid = this.test();

    if (valid) {
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
  test: function() {
    var i, validator, valid = 0;

    for (i = 0; (validator = this.__validators[i]); i++) {
      if (validator.test()) {
        valid++;
      } else {
        this.__errors.push(validator);
      }
    }

    return this.passOnAny() && valid > 0 ||
           !this.passOnAny() && valid == this.__validators.length;
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
    v2.Interface.ensure(message, v2.Message);
    this.__message = message;
  },

  /**
   * @see v2.FormItem.getMessages
   */
  getMessages: function() {
    if (this.__errors.length === 0) {
      return [];
    }

    if (!v2.empty(this.__message)) {
      return [this.__message];
    }

    var messages = [], i, validator;

    for (i = 0, validator; (validator = this.__errors[i]); i++) {
      messages.concat(validator.getMessages());
    }

    return messages;
  },

  /**
   * @see v2.FormItem.passOnAny
   */
  passOnAny: function() {
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
  onFailure: function() {}
});

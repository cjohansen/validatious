/**
 * @class A validator encapsulates the logic required to validate a value with
 * some parameters.
 *
 * @depends v2.js
 * @depends message.js
 */
v2.Validator = Base.extend(/** @scope v2.Validator.prototype */{
  constructor: function(name, fn, message, params, aliases) {
    this.__name = name;
    this.__test = fn;
    this.__message = new v2.Message(message || '${field} does not pass ' + name + ' validator', params);
    this.__aliases = v2.array(aliases);
    this.acceptEmpty = true;
  },

  /**
   * Test a value given some parameters.
   */
  test: function(field, params, invert) {
    invert = typeof invert === 'undefined' ? false : invert;

    var value = field.getValue();
    var result = (this.acceptEmpty && value === '') ||
      this.__test(field, value, params);

    return (result && !invert) || (!result && invert);
  },

  /**
   * @return the name of the validator
   */
  getName: function() {
    return this.__name;
  },

  /**
   * @return the message object
   */
  getMessage: function() {
    return this.__message;
  },

  /**
   * @param {String} message New error message
   */
  setMessage: function(message) {
    this.__message.message = message;
  }
}, /** @scope v2.Validator */{
  validators: {},

  /**
   * Adds a validator and returns a proper v2.Validator object. This method
   * takes a single object as parameter, and fetches options from object
   * properties:
   *
   * @param {String}   name        Validators name
   * @param {Function} fn          The test function, should accept two
   *                               parameters: value and parameters (array)
   * @param {String}   message     Default error message
   * @param {Array}    params      Option strings to replace in the message string
   * @param {Array}    aliases     Additional aliases for the validator, may be
   *                               a string, an array or nothing
   * @param {boolean}  acceptEmpty If false, the validator will fail empty
   *                               values. Default is true.
   */
  add: function(options) {
    if (!options.name || !options.fn) {
      throw new TypeError('Options object should contain name and fn');
    }

    // Merge options with default options
    options = v2.Object.extend({ params: [], aliases: [], acceptEmpty: true }, options, false);

    var params = v2.array(options.params);
    var validator = new v2.Validator(options.name, options.fn, options.message, params, options.aliases);
    validator.acceptEmpty = options.acceptEmpty;

    var names = v2.array(options.aliases).concat([options.name]);

    for (var i = 0, name; (name = names[i]); i++) {
      v2.Validator.validators[name] = validator;
    }

    return validator;
  },

  /**
   * Frontend to the add method. Adds a validator, only with "normal" parameters
   * instead of a single object literal options "hash".
   *
   * @param {String}   name        Validators name
   * @param {Function} fn          The test function, should accept two
   *                               parameters: value and parameters (array)
   * @param {Array}    params      Option strings to replace in the message string
   * @param {String}   message     Default error message
   * @param {Array}    aliases     Additional aliases for the validator, may be
   *                               a string, an array or nothing
   * @param {boolean}  acceptEmpty If false, the validator will fail empty
   *                               values. Default is true.
   */
  reg: function(name, fn, params, message, aliases, acceptEmpty) {
    return v2.Validator.add({ name: name,
                              fn: fn,
                              message: message,
                              params: params,
                              aliases: aliases,
                              acceptEmpty: acceptEmpty });
  },

  /**
   * Get the validator with the given name. Searches all validators aliases as
   * well.
   *
   * @param {String}  name        The validator to fetch
   */
  get: function(name) {
    var validator;

    if (name.constructor === v2.Validator) {
      return name;
    }

    if ((validator = v2.Validator.validators[name])) {
      return validator;
    }

    return null;
  }
});

/**
 * Shorthand for v2.Validator.get
 */
v2.$v = function(name) {
  return v2.Validator.get(name);
};

/**
 * Set new message for validator. If the validator does not exist, an exception
 * is thrown. This method will accept either two strings - a validator name and
 * message, OR an object where the property names will be interpreted as
 * validator names, and property values as messages. When the single parameter
 * is an object, non-existent validators are silently bypassed, whereas for two
 * strings, an exception is thrown for non-existent validators.
 *
 * @param {String} name    The validator to update message for, or an object
 * @param {String} message The new error message
 */
v2.$msg = function(/*name, message*/) {
  if (arguments.length === 2) {
    return v2.Validator.get(arguments[0]).setMessage(arguments[1]);
  }

  var args = arguments[0];

  for (var validator in args) {
    try {
      v2.Validator.get(validator).setMessage(args[validator]);
    } catch(e) {
      // Fail silently
    }
  }
};

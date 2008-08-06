/**
 * @class A validator encapsulates the logic required to validate a value with
 * some parameters.
 */
v2.Validator = Base.extend(/** @scope v2.Validator.prototype */{
  constructor: function(name, fn, message, aliases) {
    //v2.Interface.ensure(error, v2.Message);
    this.__name = name;
    this.__test = fn;
    this.__message = message;
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
  }
}, /** @scope v2.Validator */{
  validators: {},

  /**
   * Adds a validator and returns a proper v2.Validator object
   *
   * @param {String}   name        Validators name
   * @param {Function} fn          The test function, should accept two
   *                               parameters: value and parameters (array)
   * @param {String}   msg         Default error message
   * @param {Array}    aliases     Additional aliases for the validator, may be
   *                               a string, an array or nothing
   * @param {boolean}  acceptEmpty If false, the validator will fail empty
   *                               values. Default is true.
   */
  add: function(options) {
    if (!options.name || !options.fn || !options.message) {
      throw new TypeError('Options object should contain name, fn and message');
    }

    var message = new v2.Message(options.message, options.params || []);
    var validator = new v2.Validator(options.name, options.fn, message, options.aliases);
    validator.acceptEmpty = typeof options.acceptEmpty === 'undefined' ? true : options.acceptEmpty;

    var names = (options.aliases || []).concat([options.name]);

    for (var i = 0, name; (name = names[i]); i++) {
      v2.Validator.validators[name] = validator;
    }

    return validator;
  },

  /**
   * Get the validator with the given name. Searches all validators aliases as
   * well.
   *
   * @param {String}  name        The validator to fetch
   */
  get: function(name) {
    var validator;

    if ((validator = v2.Validator.validators[name])) {
      return validator;
    }

    return null;
  }
});

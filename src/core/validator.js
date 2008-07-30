/**
 * @class A validator encapsulates the logic required to validate a value with
 * some parameters.
 */
v2.Validator = Base.extend(/** @scope v2.Validator.prototype */{
  constructor: function(name, fn, message, aliases) {
    v2.Interface.ensure(error, v2.Message);
    this.__name = name;
    this.__test = fn;
    this.__message = message;
    this.__aliases = v2.array(aliases);
    this.acceptEmpty = true;
  },

  /**
   * Test a value given some parameters.
   */
  test: function(field, value, params, invert) {
    invert = typeof invert == 'undefined' ? false : invert;
    var result = (this.acceptEmpty && value == '') ||
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
   * Returns true if the validator responds to the given alias
   *
   * @param {String} alias
   * @return true if the validator responds to the alias
   */
  respondsToAlias: function(alias) {
    for (var i = 0, a; (a = this.__aliases[i]); i++) {
      if (a === alias) {
        return true;
      }
    }

    return false;
  }
}, /** @scope v2.Validator */{
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
  add: function(name, fn, msg, aliases, acceptEmpty) {
    if (typeof v2.Validator.validators == 'undefined') {
      v2.Validator.validators = [];
    }

    var isArray = msg.constructor == Array;
    var msgStr = isArray ? msg.shift() : msg;
    msg = new v2.Message(msgStr, isArray ? msg : []);
    var validator = new v2.Validator(name, fn, msg, aliases);
    validator.acceptEmpty = typeof acceptEmpty == 'undefined' ? true : acceptEmpty;
    v2.Validator.validators.push(validator);

    return validator;
  },

  /**
   * Get the validator with the given name. Searches all validators aliases as
   * well, unless the skipAliases parameter is false.
   *
   * @param {String}  name        The validator to fetch
   * @param {boolean} skipAliases If true, aliases will not be searched, default
   *                              false
   */
  get: function(name, skipAliases) {
    skipAliases = typeof skipAliases === 'undefined' ? false : skipAliases;
    var validator, alias, i, j;

    if (typeof v2.Validator.validators === 'undefined') {
      v2.Validator.validators = [];
    }

    for (i = 0; (validator = v2.Validator.validators[i]); i++) {
      if (validator.getName() === name) {
        return validator;
      } else if (!skipAliases && validator.respondsToAlias(name)) {
        return validator;
      }
    }

    return null;
  }
});

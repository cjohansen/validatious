/**
 * @class Represents a single field and validator along with an optional custom
 * error message when the default message is not suitable.
 */
v2.FieldValidator = Base.extend(/** @scope v2.FieldValidator.prototype */{
  invert: false,

  /**
   * Creates a new field validator.
   *
   * @param {v2.InputElement} field     The field to validate
   * @param {Array}           validator Validator
   * @param {Array}           params    Parameters
   * @param {String}          msg       Optional error message. If empty,
   *                                    default message for the validator is
   *                                    used.
   */
  constructor: function(field, validator, params, msg) {
    this.__field = field;
    this.__validator = validator;
    this.__params = v2.array(params);
    this.__message = msg || validator.__message.copy();
    var errorSwitches = this.__message.params;

    if (errorSwitches.length < 1 || errorSwitches[0] !== 'field') {
      this.__message.params = ['field'].concat(this.__message.params);
    }

    this.__message.values = [this.__field.getName()].concat(this.__params);
  },

  /**
   * Returns true if the field passes the value given the parameters
   */
  test: function() {
    return this.__validator.test(this.__field, this.__params, this.invert);
  },

  /**
   * Calls test()
   */
  validate: function() {
    return this.test();
  },

  /**
   * Returns the error message
   */
  getMessages: function() {
    return [this.__message.toString()];
  }
});

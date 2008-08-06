/**
 * @class Represents a single field and validator along with an optional custom
 * error message when the default message is not suitable.
 */
v2.FieldValidator = Base.extend(/** @scope v2.FieldValidator.prototype */{
  invert: false,

  /**
   * Creates a new field validator.
   *
   * @param {v2.InputElement} input     The field to validate
   * @param {Array}           validator Validator
   * @param {Array}           params    Parameters
   * @param {String}          msg       Optional error message. If empty,
   *                                    default message for the validator is
   *                                    used.
   */
  constructor: function(input, validator, params, msg) {
    this.input = input;
    this.validator = validator;
    this.params = v2.array(params);
    this.error = msg || validator.error.copy();
    var errorSwitches = this.error.params;

    if (errorSwitches.length < 1 || errorSwitches[0] !== 'field') {
      this.error.params = ['field'].concat(this.error.params);
    }

    this.error.values = [this.input.getName()].concat(this.params);
  },

  /**
   * Returns true if the field passes the value given the parameters
   */
  test: function() {
    return this.validator.test(this.input, this.params, this.invert);
  }
});

/**
 * @class The message object store an error message with interpolated
 * parameters.
 *
 * @depends v2.js
 */
v2.Message = Base.extend(/** @scope v2.Message */{
  /**
   * Constructs a new message
   *
   * @param {String} message The message string.
   * @param {Array}  params  Array of parameters if the string makes use of
   *                         variables to be interpolated into the string
   * @param {Array}  values  Array of parameter values, if any
   */
  constructor: function(message, params, values) {
    this.message = message;
    this.params = params || [];
    this.values = values || [];
  },

  /**
   * @return a new v2.Message object with the same message, params and values
   *         as this (shallow copy)
   */
  copy: function() {
    return new v2.Message(this.message, this.params, this.values);
  },

  /**
   * Returns the string interpolated with parameter values
   */
  toString: function() {
    var str = this.message + '';

    for (var i = 0, param = null; (param = this.params[i]); i++) {
      str = str.replace('${' + param + '}', this.values[i]);
    }

    return str;
  }
});

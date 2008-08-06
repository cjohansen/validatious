/**
 * Simple interface implementation. Provides a way to ensure that a "class" or
 * object supports a set of methods.
 */
v2.Interface = Base.extend(/** @scope v2.Interface.prototype */{
  /**
   * Construct a new interface. The interface defines a name and a list of
   * methods it supports.
   *
   * @param {String} name   The name of the interface
   * @param {Array} methods The methods the interface supports
   */
  constructor: function(name, methods) {
    this.name = name;
    this.methods = v2.array(methods);
  }
}, /** @scope v2.Interface */{
  /**
   * Ensures that an object implements an interface by checking that it
   * implements of the interfaces methods.
   *
   * @param {Object} obj        The object to check
   * @param {Object} interfaces A single object or an array of interface objects
   *                            to check against
   */
  ensure: function(obj, interfaces) {
    var i, j, iface, method;
    interfaces = v2.array(interfaces);

    for (i = 0, iface; (iface = interfaces[i]); i++) {
      for (j = 0; (method = iface.methods[j]); j++) {
        if (typeof obj[method] !== 'function') {
          throw new TypeError('Object does not implement ' + iface.name +
                              ', missing or wrong type: ' + method + ' (' +
                              typeof(obj[method]) + ')');
        }
      }
    }
  }
});

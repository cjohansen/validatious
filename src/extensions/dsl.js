/**
 * Provides facades with methods to allow for a natural language
 * like API.
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @version 0.1
 * @license BSD
 */
/*!
 * Copyright (c) 2008, Christian Johansen
 * All rights reserved.
 * http://opensource.org/licenses/bsd-license.php
 */
/**
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *   - Redistributions of source code must retain the above copyright notice,
 *     this list of conditions and the following disclaimer.
 *   - Redistributions in binary form must reproduce the above copyright notice,
 *     this list of conditions and the following disclaimer in the documentation
 *     and/or other materials provided with the distribution.
 *   - Neither the name of Christian Johansen nor the names of his contributors
 *     may be used to endorse or promote products derived from this software
 *     without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE
 */

/**
 * Top level DSL functionality. Use v2.dsl.expose() to expose methods to the
 * global namespace.
 */
v2.dsl = /** @scope v2.dsl */{
  /**
   * Creates a validate function. The conditional parameter decides if the
   * function should require all validators, or only one.
   *
   * @param {boolean} conditional   If true, all validators are required
   */
  __validateTemplate: function(conditional) {
    return function() {
      var field = arguments[0];
      var element = field.element || (field.item ? field.item.element : null) || null;

      if (element === null) {
        while (!!field && !field.element) {
          field = field.get(0);
        }
      }

      var form = v2.Form.get(element.getElements()[0].form);
      form.passOnAny(conditional);

      for (var i = 0, component; (component = arguments[i]); i++) {
        form.add(component.item || component);
      }

      return form;
    };
  },

  /**
   * Returns a function that joins composite form item objects. The conditional
   * decides if all items are required or not.
   *
   * @param {boolean} conditional
   */
  __andOr: function(conditional) {
    return function() {
      var cfi = new v2.dsl.Collection();
      cfi.item.passOnAny(conditional);

      for (var i = 0, component; (component = arguments[i]); i++) {
        cfi.item.add(component.item);
      }

      return cfi;
    };
  }
};

/**
 * Exposes DSL utilities (validate, validateAll, validateAny, and, or)
 * to the global namespace
 */
v2.dsl.expose = function() {
  var v = v2.dsl;

  v2.Object.extend(window, /** @scope window */{
    validate: v.validate,
    validateAll: v.validateAll,
    validateAny: v.validateAny,
    and: v.and,
    or: v.or
  }, false);
};

/**
 * Validate a form with a set of validators, require all validators to pass in
 * order to pass the form.
 *
 * Aliased as v2.validate
 */
v2.dsl.validateAll = v2.dsl.validate = v2.dsl.__validateTemplate(false);

/**
 * Validate a form with a set of validators, require only a single validators to
 * pass in order to pass the form.
 */
v2.dsl.validateAny = v2.dsl.__validateTemplate(true);

/**
 * Joins composite form item objects. Requires all components to pass.
 */
v2.dsl.and = v2.dsl.__andOr(false);

/**
 * Joins composite form item objects. Requires any components to pass.
 */
v2.dsl.or = v2.dsl.__andOr(true);

/**
 * Augment string objects to allow for syntax where validators are added
 * directly to strings which represent element selectors.
 */
v2.Object.extend(String.prototype, {
  /**
   * Use a string as an input element id/name. Applies the validator to the
   * field and returns the field object.
   *
   * Only supports strings as field ids, not arbitrary selectors.
   *
   * This method is also aliased as isA, isAn, has, hasA and hasAn
   *
   * @param {String} validator The validator to add
   * @param {Array}  params    Optional parameters
   * @return {v2.dsl.Field} the field object
   */
  is: function(validator, params) {
    var facade = new v2.dsl.Field(this.toString());
    return facade.addValidator(validator, params);
  }
});

/**
 * isA, isAn, has, hasA, hasAn - aliases for String.prototype.isA
 */
(function() {
  var s = String.prototype;
  s.isA = s.isAn = s.has = s.hasA = s.hasAn = s.is;
})();

/**
 * DSL capabilities for fields
 */
v2.dsl.Field = Base.extend(/** @scope v2.dsl.Field.prototype */{
  __currentValidator: null,
  __and: null,

  /**
   * Wraps a v2.Field object in a facade API. The field object is available
   * through the public property field.
   */
  constructor: function(stringOrId) {
    this.item = new v2.Field(stringOrId);
  },

  /**
   * Adds a validator to this field. If the method has previously been called with a
   * different value for the conditional this method will throw an exception.
   *
   * Aliased as and, andIs, andHas, or, orIs, orHas
   *
   * @param {String}  validator The validator to add
   * @param {Array}   params    Optional parameters
   * @param {boolean} and       If true, this field must pass all validators
   * @return {v2.dsl.Field} this object
   */
  addValidator: function(validator, params, and) {
    if (typeof and !== "undefined") {
      if (this.__and !== null && this.__and !== and) {
        throw new Error("Field previously set up with " +
                        (this.__and ? "AND" : "OR") +
                        ", unable to shift");
      }

      this.__and = and;
      this.item.passOnAny(!and);
    }

    this.__currentValidator = this.item.addValidator(validator, params);

    return this;
  },

  /**
   * Adds more validators. Throws an exception if it is invoked before any
   * validators are added.
   *
   * @param {String}  validator   The validator to add
   * @param {Array}   params      Optional parameters
   * @return {v2.dsl.Field} this object
   */
  and: function(validator, params) {
    if (!this.__currentValidator) {
      throw new Error("Cannot add more validators when no validators are added yet");
    }

    return this.addValidator(validator, params, true);
  },

  /**
   * Adds more validators. Throws an exception if it is invoked before any
   * validators are added.
   *
   * @param {String}  validator   The validator to add
   * @param {Array}   params      Optional parameters
   * @return {v2.dsl.Field} this object
   */
  or: function(validator, params) {
    if (!!this.__currentValidator) {
      throw new Error("Cannot add more validators when no validators are added yet");
    }

    return this.addValidator(validator, params, false);
  },

  /**
   * Adds a custom error message to the current validator
   *
   * @param {String} message The message
   */
  explain: function(message) {
    if (!this.__currentValidator) {
      throw new Error('No active field validator');
    }

    this.__currentValidator.setMessage(message);

    return this;
  },

  /**
   * Adds a custom error message to the field
   *
   * @param {String} message The message
   */
  help: function(message) {
    this.item.setMessage(message);

    return this;
  },

  /**
   * Sets the name of the field element
   */
  withName: function(name) {
    this.item.element.setName(name);

    return this;
  }
});

/**
 * orIs, orIsA, orIsAn, orHas, orHasA, orHasAn are aliases for v2.dsl.Field.or
 * andIs, andIsA, andIsAn, andHas, andHasA, andHasAn are aliases for v2.dsl.Field.and
 */
(function() {
  var v = v2.dsl.Field.prototype;
  v.orIs = v.orIsA = v.orIsAn = v.orHas = v.orHasA = v.orHasAn = v.or;
  v.andIs = v.andIsA = v.andIsAn = v.andHas = v.andHasA = v.andHasAn = v.and;
})();

/**
 * Field collections with DSL capabilities
 */
v2.dsl.Collection = Base.extend(/** @scope v2.dsl.Collection.prototype */{
  /**
   * Create a new fieldset/collection
   */
  constructor: function() {
    this.item = new v2.CompositeFormItem();
  },

  /**
   * Set a custom error message for the entire collection
   *
   * @param {String} message The custom error message
   */
  explain: function(message) {
    this.item.setMessage(message);
  }
});

/*
 * This anonymous function compresses slightly better than writing the whole
 * thing out.
 *
(function() {
  var v2dsl = v2.dsl;
  var field = v2dsl.Field.prototype;
  var collection = v2dsl.Collection.prototype;

  /**
   * Makes the validator depend on another validator. If the other validator
   * passes validation, then this validator is tested.
   *
  field.whenValid = collection.whenValid = function(item) {
    this.item.addException(item.item || item, false);
    return this;
  };

  /**
   * Makes the validator depend on another validator. If the other validator
   * fails validation, then this validator is tested.
   *
  field.whenInvalid = collection.whenInvalid = function(item) {
    this.item.addException(item.item || item, true);
    return this;
  };
 })();
*/

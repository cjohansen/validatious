/**
 * Augments Validatious classes with methods to allow for a natural language
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
 * Augment string objects to allow for syntax where validators are added
 * directly to strings which represent element selectors.
 */
v2.Object.extend(String.prototype, {
  /**
   * Use a string as a form element selector. Finds or creates the corresponding
   * v2.Form object and then looks up the field and returns it.
   *
   * Currently only supports lookup by id
   *
   * @param {String|Element} field The field to validate, either string or
   *                               element
   * @return {v2.Field} the field
   */
  validates: function(field) {
    var form = v2.$(this);
    form = form.__v2 || new v2.Form(form);

    return form.validates(field);
  },

  /**
   * Use a string as an input element selector. Finds all elements and resolves
   * their form and v2.Form elements and then applies the validator to the field.
   *
   * Currently only supports lookup by id
   *
   * This method is also aliased as isA, isAn, has, hasA and hasAn
   *
   * @param {String} validator The validator(s) to add. Can be a string or array
   * @param {Array}  params    Optional parameters
   * @return {v2.FieldValidation} the (last) field validation object
   */
  is: function(validator, params) {
    // TODO: support more selectors
    var i, form, field, validation, fields = [v2.$(this.toString())];

    for (i = 0; field = fields[i]; i++) {
      form = field.form.__v2 || new v2.Form(field.form);
      validation = form.field(field).is(validator, params);
    }

    return validation;
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
 * Augments v2.Form with DSL capabilities
 */
v2.Object.extend(v2.Form.prototype, {
  /**
   * Looks up a field and returns it
   *
   * @param {String|Element} field The field to validate, either string or
   *                               element
   * @return {v2.Field} the field
   */
  validates: function(query) {
    return this.field(query);
  }
});

/**
 * Augments v2.Field with DSL capabilities
 */
v2.Object.extend(v2.Field.prototype, {
  currentValidation: null,

  /**
   * Creates a v2.FieldValidation and adds a v2.FieldValidator to it and then
   * returns the field validation object.
   *
   * If a validation is active for this object (ie, one or more validators has
   * beend added, and v2.FieldValidation.unless() has been called)
   *
   * @param {String} validator The validator to add
   * @param {Array}  params    Single parameter or array of params
   * @return {v2.FieldValidation} The newly created field validation
   */
  is: function(validator, params) {
    // There is an active validation for this field
    if (this.currentValidation) {
      var current = this.currentValidation;
      this.currentValidation = null;

      return current.is(validator, params);
    }

    var validation = new v2.FieldValidation(this.field);
    this.validations.push(validation.is(validator, params));

    return validation;
  }
});

/**
 * isA, isAn, has, hasA, hasAn - aliases for v2.Field.isA
 */
(function() {
   var v = v2.Field.prototype;
   v.isA = v.isAn = v.has = v.hasA = v.hasAn = v.is;
 })();

/**
 * Augments v2.FieldValidation with DSL capabilities
 */
v2.Object.extend(v2.FieldValidation.prototype, {
  __condField: null,

  /**
   * Adds a custom error message to the most recent validator
   *
   * @param {String} message Error message
   * @param {Array}  params  Message parameters
   * @return {v2.FieldValidation} this object
   */
  explain: function(message, params) {
    var validators = this.validators;
    validators[validators.length - 1].error = new v2.Message(message, params);

    return this;
  },

  /**
   * Adds a v2.FieldValidator and returns this. If the unless() method has been
   * called on this object the method will instead add a validator to the
   * validations conditions list.
   *
   * @param {String} validator The validator to add
   * @param {Array}  params    Single parameter or array of params
   * @return {v2.FieldValidation} This object
   */
  is: function(validator, params) {
    var validators = v2.array(validator);

    for (var i = 0; validator = validators[i]; i++) {
      if (this.__condField) {
        this.addCondition(this.__condField, validator, params);
      } else {
        this.addValidator(validator, params);
      }
    }

    return this;
  },

  /**
   * Without parameters simply returns this object. Suitable for adding several
   * validators to a single field in a natural language like "sentence".
   *
   * Turns validation into an "all validators must pass" validation.
   *
   * @param {String} validator Optional validator name, or array of names
   * @param {Array}  params    Optional parameters for validation
   */
  and: function(validator, params) {
    return this.__andOr(validator, params, true);
  },

  /**
   * Without parameters simply returns this object. Suitable for adding several
   * validators to a single field in a natural language like "sentence".
   *
   * Turns validation into an "only one validator needs to pass" validation.
   *
   * @param {String} validator Optional validator name, or array of names
   * @param {Array}  params    Optional parameters for validation
   */
  or: function(validator, params) {
    return this.__andOr(validator, params, false);
  },

  /**
   * Prepares validation to register conditionals on a field. The
   * method updates the internal state so that calling and() and other
   * methods will append to the condition list instead of validator list
   * from this point.
   *
   * @param {String|v2.Field} field The field to add a condition on
   * @return {v2.FieldValidation} this object
   */
  unless: function(field) {
    field = v2.Field.instance(field);
    this.__condField = field.field;
    field.currentValidation = this;

    return field;
  },

  /**
   * Adds a validator and sets whether or not validator chain/condition chain
   * should evaluate with logical AND or OR (flagVal - true: AND).
   *
   * When unless() has previously been called the first parameter to this method
   * should be a field or a string representing an id for a field.
   *
   * @param {String}  validator Optional name or array of validators OR field
   * @param {Array}   params    Optional array of parameters
   * @param {flagVal} flagVal   The value of the internal flag
   */
  __andOr: function(validator, params, flagVal) {
    // this.__condField is set when unless() has been called
    if (this.__condField) {
      this.passAllConditions = flagVal;

      if (!v2.empty(validator)) {
        if (v2.Validator.get(validator)) {
          return this.is(validator, params);
        } else {
          this.__condField = v2.$(validator);
        }
      }
    } else {
      this.passAllValidators = flagVal;

      if (!v2.empty(validator)) {
        return this.is(validator, params);
      }
    }

    return this;
  }
});

/**
 * andIs, andIsA, andIsAn, andHas, andHasA, andHasAn - aliases for
 * v2.FieldValidation.and
 *
 * isA, isAn, has, hasA, hasAn - aliases for v2.FieldValidation.is
 */
(function() {
   var v = v2.FieldValidation.prototype;
   v.andIs = v.andIsA = v.andIsAn = v.andHas = v.andHasA = v.andHasAn = v.and;
   v.orIs = v.orIsA = v.orIsAn = v.orHas = v.orHasA = v.orHasAn = v.or;
   v.isA = v.isAn = v.has = v.hasA = v.hasAn = v.is;
 })();

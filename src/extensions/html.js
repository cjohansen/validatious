/**
 * Provides a declarative way of adding form validation through semantic HTML.
 * More specifically, by adding the class name 'validate' (customizable through
 * v2.Form.autoValidateClass) to a form, every input, select and textarea
 * element will be searched for validators through their class names. Validators
 * are class names that correspond to registered validators.
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
 * Addons to the v2.Validator "class" object. Adds the prefix setting that can
 * be used when validator names may interfere with other class names in your
 * system. By default the prefix is empty, which means that
 *   <input ... class="required" />
 *
 * will enable the required validator.
 *
 * By setting
 *   v2.Validator.prefix = 'v2_';
 *
 *   <input ... class="required" />
 *
 * will no longer enable the validator, however, you can enable it through
 *   <input ... class="v2_required" />
 *
 * Prefix may not contain spaces. If you care about valid HTML you should also
 * avoid characters that are not allowed in HTML class names, allthough
 * Validatious will work fine with them.
 */
v2.Object.extend(v2.Validator, /** @scope v2.Validator */{
  prefix: ''
});

/**
 * Adds two settings to the v2.Form "class" object;
 *
 * autoValidateClass (default value 'validate')
 * All forms with this class name will have validation logic added to them. Any
 * form not having this class will not be touched.
 *
 * actionButtonClass (default value 'action')
 * This property decides which class name to look up action buttons on. Any
 * buttons with this class name will be added to the button list. If there are
 * no buttons with this class, all buttons trigger validation. If there are any
 * buttons with this class name, only these buttons will trigger validation.
 */
v2.Object.extend(v2.Form, {
  autoValidateClass: 'validate',
  actionButtonClass: 'action'
});

v2.html = {
  collectionAnyClass: 'validate_any',
  collectionAllClass: 'validate_all',

  /**
   * Resolves validators by splitting a string on underscores. A string may
   * specify a validator in the following way:
   *
   * (prefix)?(not_)?name(_param)*
   *
   * That is:
   *   - Start string with optional prefix. This prefix is configured through
   *     v2.Validator.prefix
   *   - Optional not_ prefix. This will cause the validator to be inverted.
   *   - Validator name can be any existing validator (including aliases).
   *   - An optional list of parameters, for instance: min-length_3
   *
   * @param {String} names Potential validator names. Validators that aren't
   *                       found are silently ignored
   * @return an array of objects containing properties validator and params
   */
  validatorsFromString: function(field, names) {
    var prefixStr = v2.Validator.prefix;
    var prefix = new RegExp("^" + prefixStr, '');
    var j, className, invert, params, validator, validators = [];
    names = names.split(' ');

    // Loop classes
    for (j = 0; (className = names[j]); j++) {
      invert = false;

      // Don't continue without prefix if a prefix is configured
      if (!v2.empty(prefixStr) && !prefix.test(className)) {
        continue;
      }

      // Strip out prefix
      className = className.replace(prefix, '');

      // Check if validator should be inverted
      if (/^not_/.test(className)) {
        className = className.replace(/^not_/, '');
        invert = true;
      }

      // Get parameters
      params = className.split('_');
      validator = params.shift();

      if (validator && (validator = v2.$v(validator))) {
        validators.push({ validator: validator,
                          params: params,
                          invert: invert });
      }
    }

    return this;
  }
};

/**
 * Resolves validation markup from a form
 */
v2.html.Form = Base.extend(/** @scope v2.html.prototype */{

  /**
   * Constructs a new validation form
   *
   * @param {FormElement} form
   */
  constructor: function(form) {
    this.form = v2.Form.get(form);
    this.__parsed = {};

    this.parseContainer(form, this.form);

    if (v2.Element.hasClassName(form, v2.html.validateAnyClass)) {
      this.form.passOnAny(true);
    }
  },

  parseContainer: function(container, collection, validators) {
    var elements = v2.$$('input, select, textarea, div, fieldset', collection);
    var i, j, validator, fieldValidator, element, tagName, subCollection;//, j, element, marked = {}, tagName;
    this.__parsed[container.id || container.name] = true;
    validators = validators || [];

    // Loop through all elements
    for (i = 0; (element = elements[i]); i++) {
      // Need classes to find validators, skip elements with no classes
      // Input elements may have been bound to a container collection, skip these too
      if (/^\s*$/.test(element.className) || this.__parsed[element.id || element.name]) {
        continue;
      }

      tagName = element.tagName.toLowerCase();

      // Look for button
      if (tagName === 'input' &&
          v2.Element.hasClassName(element, v2.Form.actionButtonClass)) {
        this.form.addButton(element);
        continue;
      }

      // Process block elements/containers
      if (['div', 'fieldset'].indexOf(tagName) >= 0) {
        // If a collection was created, add it and start loop over
        if ((subCollection = this.parseSubContainer(element))) {
          collection.add(subCollection);
        }

        continue;
      }

      // Create field object
      field = new v2.html.Field(v2.$f(element));

      // "Discover" validators
      field.discover(element);
      this.__parsed[element.id || element.name] = true;

      for (j = 0; (validator = validators[j]); j++) {
        fieldValidator = field.addValidator(validator.validator, validator.params);
        fieldValidator.invert = validator.invert;
      }

      // Add to collection
      if (field.get().length > 0) {
        collection.add(field);
      }
    }
  },

  /**
   * Processes a container element and creates a validator collection.
   *
   * The container element can have a class name v2.html.collectionAnyClass, or
   * v2.html.collectionAllClass, which denotes that only one of the elements in
   * the collection needs to be valid, or that all should be valid.
   *
   * These classes control the behaviour of the collection, and validation may
   * be added to the collection members (input elements or collections in the
   * subtree of the element) in two ways:
   *
   * 1) Normal validation: validators are set up for each input/select/textarea
   *    in the subtree
   * 2) Group validation: validators are set through the class name of the
   *    container. All sub elements will get the same validators (in addition
   *    to any field specific validators)
   *
   * The two ways can be combined.
   *
   * If the container element does not have either of the two aforementioned
   * class names, it is skipped.
   */
  processSubContainer: function(element) {
    var collection = new v2.CompositeFormItem();

    // Augment element
    v2.$(element);

    if (element.hasClassName(v2.html.validateAnyClass)) {
      collection.passOnAny(true);
    } else if (element.hasClassName(v2.html.validateAllClass)) {
      collection.passOnAny(false);
    } else {
      return null;
    }

    var validators = v2.html.validatorsFromString(element.className);
    this.processContainer(element, collection, validators);

    return collection;
  }
});

/**
 * Facade for adding validation through semantic markup
 *
v2.html.Form = /** @scope v2.html.Form *{
  /*
   * Searches through all elements inside the form and adds validators found
   * through class names.
   *
   * @param {Element} form The form element to add validation for
   *
  addValidationFromHTML: function(form) {
    var elements = v2.$$('input, select, textarea, div, fieldset', form);
    form = v2.Form.get(form);
    var classes, i, j, element, marked = {}, tagName, collection;

    // Loop through all elements
    for (i = 0; (element = elements[i]); i++) {
      // Need classes to find validators, skip elements with no classes
      // Input elements may have been bound to a container collection, skip these too
      if (/^\s*$/.test(element.className) || used[element.id || element.name]) {
        continue;
      }

      tagName = element.tagName.toLowerCase();

      // Look for button
      if (tagName === 'input' &&
          v2.Element.hasClassName(element, v2.Form.actionButtonClass)) {
        form.addButton(element);
        continue;
      }

      // Process block elements/containers
      if (['div', 'fieldset'].indexOf(tagName) >= 0) {
        collection = v2.html.processContainer(element, function(input) {
          used[input.id || input.name] = true;
        });

        // If a collection was created, add it and start loop over
        if (collection) {
          form.add(collection);
        }

        continue;
      }

      // Create field object
      field = new v2.Field(v2.$f(element));

      // "Discover" validators
      v2.html.Field.add(field, element.className);

      // Add to form
      if (field.__validators.length > 0) {
        form.add(field);
      }
    }
  }
};

/**
 * Facade for facilitating adding validators from a space separated string
 */
v2.html.Field = Base.extend(/** @scope v2.html.Field.prototype */{
  constructor: function(field) {

  },

  /**
   * @return this field, enables chaining
   */
  add: function() {
    var prefixStr = v2.Validator.prefix;
    var prefix = new RegExp("^" + prefixStr, '');
    var j, className, invert, params, validator, validators = [];
    names = names.split(' ');
/*
    // Loop classes
    for (j = 0; (className = names[j]); j++) {
      invert = false;

      // Don't continue without prefix if a prefix is configured
      if (!v2.empty(prefixStr) && !prefix.test(className)) {
        continue;
      }

      // Strip out prefix
      className = className.replace(prefix, '');

      // Check if validator should be inverted
      if (/^not_/.test(className)) {
        className = className.replace(/^not_/, '');
        invert = true;
      }

      // Get parameters
      params = className.split('_');
      validator = params.shift();

      // Add validator if validator was found
      if (validator !== null) {
        // Custom error messages may be specified through the title attribute
        // for input/select/textarea elements
        title = field.element.getElements()[0].title;

        try {
          if (!v2.empty(title)) {
            validator = field.addValidator(validator, params, title);
          } else {
            validator = field.addValidator(validator, params);
          }

          validator.invert = invert;
        } catch (e) { // Fail silently - just a "normal" class name
}
                            }
      }*/

    return this;
  }
});

/**
 * Finds forms to validate and runs them through v2.Form.addValidationFromHTML
 */
v2.addDOMLoadEvent(function() {
  var forms = document.getElementsByTagName('form');

  for (var i = 0, form; (form = forms[i]); i++) {
    if (v2.Element.hasClassName(form, v2.Form.autoValidateClass)) {
      new v2.html.Form(form);
    }
  }
});

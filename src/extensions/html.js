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

/**
 * Facade for adding validation through semantic markup
 */
v2.FormFacade = /** @scope v2.FormFacade */{
  /**
   * Searches through all elements inside the form and adds validators found
   * through class names.
   *
   * @param {Element} form The form element to add validation for
   */
  addValidationFromHTML: function(form) {
    var elements = v2.$$('input, select, textarea', form);
    form = v2.Form.get(form);
    var classes, i, j, element, validation;

    // Loop through all input elements
    for (i = 0; (element = elements[i]); i++) {
      // Need classes to find validators, skip elements with no classes
      if (/^\s*$/.test(element.className)) {
        continue;
      }

      // Look for button
      if (v2.Element.hasClassName(element, v2.Form.actionButtonClass)) {
        form.addButton(element);
        continue;
      }

      // Several validators may exist in the class name, separated by spaces
      classes = element.className;

      // Create field object
      field = new v2.Field(v2.$f(element));

      // "Discover" validators
      v2.FieldFacade.add(field, classes);

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
v2.FieldFacade = /** @scope v2.FieldFacade */{
  /**
   * Adds validation discovery from strings. The method resolves validator names
   * by splitting them on underscores. A string may specify a validator in the
   * following way:
   *
   * (not_)?name(_param)*
   *
   * That is:
   *   - Start string with optional not_ prefix. This will cause the validator
   *     to be inverted.
   *   - Validator name can be any existing validators. By default aliases
   *     aren't searched. This behaviour can be configured through
   *     v2.Validator.searchAliases
   *   - An optional list of parameters, for instance: min-length_3
   *
   * @param {v2.Field} field The field to add validators to
   * @param {Array}    names Potential validator names. Validators that aren't
   *                         found are silently ignored
   * @return this field, enables chaining
   */
  add: function(names) {
    var prefixStr = v2.Validator.prefix;
    var prefix = new RegExp("^" + prefixStr, '');
    var className, params, invert, validator, title;
    names = typeof names === 'string' ? names.split(' ') : names;

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

        if (!v2.empty(title)) {
          validator = field.addValidator(validator, params, title);
        } else {
          validator = validation.addValidator(validator, params);
        }

        validator.invert = invert;
      }
    }

    return this;
  }
};

/**
 * Finds forms to validate and runs them through v2.Form.addValidationFromHTML
 */
v2.addDOMLoadEvent(function() {
  var forms = document.getElementsByTagName('form');

  for (var i = 0, form; (form = forms[i]); i++) {
    if (v2.Element.hasClassName(form, v2.Form.autoValidateClass)) {
      v2.FormFacade.addValidationFromHTML(form);
    }
  }
});

/**
 * Provides a declarative way of adding form validation through semantic HTML.
 * More specifically, by adding the class name 'validate' (customizable through
 * v2.Form.autoValidateClass) to a form, every input, select and textarea
 * element will be searched for validators through their class names. Validators
 * are class names that correspond to registered validators.
 *
 * By default validator aliases are not searched, but this behaviour may be
 * overridden through v2.Validator.searchAliases
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
 * will enable the reqiuired validator.
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
 * Addons to the v2.Form object
 */
v2.Object.extend(v2.Form, {
  autoValidateClass: 'validate',
  actionButtonClass: 'action',

  /**
   * Searches through all elements inside the form and adds validators found
   * through class names.
   *
   * @param {Element} form The form element to add validation for
   */
  addValidationFromHTML: function(form) {
    var fields = v2.$$('input, select, textarea', form);
    form = new v2.Form(form);
    var classes, i, j, field, validation;

    // Loop through all input elements
    for (i = 0; (field = fields[i]); i++) {
      // Need classes to find validators, skip elements with no classes
      if (/^\s*$/.test(field.className)) {
        continue;
      }

      // Look for button
      if (v2.Element.hasClassName(field, v2.Form.actionButtonClass)) {
        form.buttons.push(field);
        continue;
      }

      // Several validators may exist in the class name, separated by spaces
      classes = field.className;

      // Create field object
      field = form.field(field);//form.field(field);

      // "Discover" validators
      field.addValidation(classes);
    }
  }
});

/**
 * Addons to the v2.Field object
 */
v2.Object.extend(v2.Field.prototype, {
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
   * @param {Array} names Potential validator names. Validators that aren't
   *                      found are silently ignored
   * @return this field, enables chaining
   */
  addValidation: function(names) {
    // Prepare valdation object
    var validation = new v2.FieldValidation(this.field);

    var prefixStr = v2.Validator.prefix.replace(/^\s*|\s*$/, '');
    var prefix = new RegExp("^" + prefixStr, '');
    var className, params, invert, validator;
    names = typeof names == 'string' ? names.split(' ') : names;

    // Loop classes
    for (j = 0; (className = names[j]); j++) {
      invert = false;

      // Don't continue without prefix if a prefix is configured
      if (!v2.empty(prefixStr) && !prefix.test(className)) {
        continue;
      } else {
        // Strip out prefix
        className = className.replace(prefix, '');
      }

      // Check if validator should be inverted
      if (/^not_/.test(className)) {
        className = className.replace(/^not_/, '');
        invert = true;
      }

      // Get parameters
      params = className.split('_');
      validator = v2.Validator.get(params.shift(), !v2.Validator.searchAliases);

      // Add validator if validator was found
      if (validator !== null) {
        // Custom error messages may be specified through title attribute for
        // input/select/textarea elements
        if (!v2.empty(this.field.title)) {
          validator = validation.addValidator(validator, params, new v2.Message(this.field.title));
        } else {
          validator = validation.addValidator(validator, params);
        }

        validator.invert = invert;
      }
    }

    // Add validation to field if validators were added
    if (validation.validators.length > 0) {
      this.validations.push(validation);
    }

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
      v2.Form.addValidationFromHTML(form);
    }
  }
});

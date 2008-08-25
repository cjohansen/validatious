/**
 * @fileOverview This file contains various library functions Validatious uses
 * when in standalone mode. When bridging Validacious to frameworks you need
 * to replicate the functionality in this file leveraging the frameworks custom
 * functionality. This will help you minimize duplication.
 */
// Global namespace
if (typeof v2 === 'undefined' || v2 === null) {
  v2 = {};
}

/**
 * Checks if a string is undefined, null or empty
 */
v2.empty = function empty(obj) {
  return typeof obj == 'undefined' || obj === null || obj === '';
};

/**
 * Returns input as array. If it is an array it is returned as is, any other
 * type of input is returned as a length 1 array with the input as only element.
 *
 * If data is undefined or null, an empty array is returned.
 *
 * @param {Object} data
 * @return {Array} data if it is an array or an array with data as only element
 */
v2.array = function array(data) {
  var arr = [];

  // NodeLists
  if (data && typeof data.item === 'function') {
    for (var i = 0; i < data.length; i++) {
      arr[i] = data[i];
    }

    data = arr;
  }

  return v2.empty(data) ? [] :
    (typeof data.shift == 'undefined' ? [data] : data);
};

/**
 * Fetches the original target for an event
 *
 * @param {Event} e
 * @return {Element} the original target element
 */
v2.target = function(e) {
  if (!e) {
    return null;
  }

  return e.explicitOriginalTarget || e.srcElement || e.target || null;
};

/**
 * Provides som object level operations. Only used inside this file. When
 * bridging, this object may be omitted if it's usage is removed from this
 * file. It is not referred from the main v2 file.
 */
v2.Object = {
  /**
   * Extend an object safely with some property. If the property is already
   * set, it will not overwrite it.
   *
   * @param {Object}  obj   Source object
   * @param {Object}  props Object literal with properties to add
   * @param {boolean} safe  If true then properties will not be overwritten
   *                        Default is false
   * @return the extended object
   */
  extend: function(obj, props, safe) {
    safe = typeof safe === 'undefined' ? false : safe;

    for (var prop in props) {
      if (safe && typeof obj[prop] !== 'undefined') {
        continue;
      }

      if (props.hasOwnProperty(prop) && typeof props[prop] !== 'undefined') {
        obj[prop] = props[prop];
      }
    }

    return obj;
  }
};

/**
 * Extensions on the array object
 */
v2.Object.extend(Array.prototype, {

  /**
   * For each loops through every element of an array yielding successive
   * elements to a callback function
   *
  forEach: function(callback, thisObj) {
    thisObj = thisObj || this;

    for (var i = 0; i < this.length; i++) {
      callback.call(thisObj, this[i]);
    }
  },*/

  /**
   * Finds the first occurence of an element and returns its index in the array
   * or -1 if the element is not found.
   *
   * @param {Object} el The element to look for
   * @param {int} start Optional start index, default is 0
   */
  indexOf: function(el, index) {
    for (var i = 0; i < this.length; i++) {
      if (this[i] === el) {
        return i;
      }
    }

    return -1;
  }/*,

  /**
   * Filter implementation, from http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Objects:Array:filter
   *
  filter: function(fun) {
    var len = this.length;

    if (typeof fun !== "function") {
      throw new TypeError();
    }

    var res = new Array();
    var thisp = arguments[1];
    var val, i;

    for (i = 0; i < len; i++) {
      if (i in this) {
        val = this[i]; // in case fun mutates this

        if (fun.call(thisp, val, i, this)) {
          res.push(val);
        }
      }
    }

    return res;
  }*/
});

/**
 * Basically wraps document.getElementById
 *
 * @param {Object} el Id as a string or element
 */
v2.$ = function(el, extend) {
  if (typeof el == 'string') {
    el = document.getElementById(el);
  }

  extend = typeof extend == 'undefined' ? true : extend;

  // Don't extend elements that were already extended
  // Abort if element was not found
  if (el === null || typeof el.hide != 'undefined' || !extend) {
    return el;
  }

  // Extend element with methods in v2.Element
  for (var prop in v2.Element) if (v2.Element.hasOwnProperty(prop)) {
    // The immediate anonymous function creates a scope for fn, and avoids
    // having the reference overwritten with every iteration
    (function() {
      var fn = prop;
      var obj = {};
      obj[fn] = function() {
        // Prefill argument list with element
        var args = [el];

        for (var i = 0; i < arguments.length; i++) {
          args.push(arguments[i]);
        }

        return v2.Element[fn].apply(v2.Element, args);
      };

      // Safe extending, don't overwrite existing methods
      v2.Object.extend(el, obj, true);
    })();
  }

  return el;
};

/**
 * Mimics $$ function available in many modern frameworks which basically works
 * like document.querySelectorAll, which is actually used if it exists. If not,
 * the method shamelessly assumes it's supposed to return either a label element
 * or an input element since that's all validatious is using it for.
 *
 * This method is ONLY intended to help validatious find labels and inputs, DO
 * NOT use this as a general CSS selector utility, it will fail miserably.
 */
v2.$$ = function $$(query, parent) {
  // WARNING: Extremely uninpressing code ahead...
  parent = parent || document;

  // Use native implementation if available
  if (document.querySelectorAll) {
    return parent.querySelectorAll(query);
  }

  // label[for=XXX] queries
  if (/^label/.test(query)) {
    var id = query.match(/label\[for=(.*)\]/)[1];
    var labels = parent.getElementsByTagName('label');

    for (var i = 0; i < labels.length; i++) {
      if (labels[i].htmlFor == id) {
        // Array expected
        return [labels[i]];
      }
    }
  } else if (query.indexOf(',') >= 0) {
    // tag1, tag2, tag3 selectors
    // Also supports tag1[attr=val], tag2[attr=valu]
    var tagNames = query.split(',');
    var elems = [];

    for (var i = 0, els; (els = tagNames[i]); i++) {
      els = els.replace(/^\s*|\s*$/, '');

      if (/\[/.test(els)) {
        els = v2.$$(els);
      } else {
        els = parent.getElementsByTagName(els);
      }

      for (var j = 0; j < els.length; j++) {
        elems.push(els[j]);
      }
    }

    return elems;
  } else {
    // Supports tag[attr=val][attr=val].class and tag[attr=val].class
    // TODO: Fix this mess........
    var className = query.split('.')[1];
    var pieces = query.match(/([^\[]*)\[([^\]]*)\](\[([^\]]*)\])?(\.(.*))?/);

    var attrs = pieces[2].split('=');
    var elems = parent.getElementsByTagName(pieces[1]);
    var els = [], valid;

    if (!v2.empty(pieces[4])) {
      attrs = attrs.concat(pieces[4].split('='));
    }

    if (!v2.empty(pieces[6])) {
      attrs.push('className');
      attrs.push(pieces[6]);
    }

    for (var i = 0; i < elems.length; i++) {
      valid = true;

      for (var j = 0; j < attrs.length; j += 2) {
        if (elems[i][attrs[j]] != attrs[j+1]) {
          valid = false;
          break;
        }
      }

      if (valid) {
        els.push(elems[i]);
      }
    }

    return els;
  }

  return null;
};

/**
 * Additional functionality for HTML elements
 */
v2.Element = {

  /**
   * Add an event listener. Delegates to Dean Edwards addEvent function.
   *
   * @param {Element} el       The element that will observe
   * @param {String} event     The event type, without the "on" handler prefix
   * @param {Function} handler The event handler
   */
  observe: function(el, event, handler) {
    addEvent(el, event, handler);
  },

  /**
   * Finds the current computed style of an element.
   *
   * @param {Element} el  The element whose styles to compute
   * @param {String} prop The property to find computed style for
   */
  computedStyle: function(el, prop) {
    var val = '';

    if (document.defaultView && document.defaultView.getComputedStyle) {
      val = document.defaultView.getComputedStyle(el, '').getPropertyValue(prop);
    } else if (el.currentStyle) {
      prop = prop.replace(/\-(\w)/g, function (match, p1) {
        return p1.toUpperCase();
      });

      val = el.currentStyle[prop];
    }

    return val;
  },

  /**
   * Checks if an element is visible by checking that its display property
   * isn't set to none, that it's visibility property is not hidden and that
   * it's width and height are not 0.
   *
   * The methods climbs the node tree recursively and checks the element and
   * all its parent nodes.
   *
   * @param {Element} el The element to check
   */
  visible: function(el) {
    return v2.Element.computedStyle(el, 'display') != 'none' &&
           v2.Element.computedStyle(el, 'visibility') != 'hidden' &&
           (el.parentNode === null ||
            el.parentNode.nodeType != 1 ||
            v2.Element.visible(el.parentNode));
  },

  /**
   * Checks if an element has a class name
   *
   * @param {Element} el        The element to check className for
   * @param {String}  className The class name to look for
   */
  hasClassName: function(el, className) {
    return new RegExp("(^|\\s)" + className + "(\\s|$)").test(el.className);
  },

  /**
   * Adds a class name to an elements className attribute unless the name
   * already exists.
   *
   * @param {Element} el        The element to add className for
   * @param {String}  className The class name to add
   * @return the element, suitable for method chaining
   */
  addClassName: function(el, className) {
    el.className += v2.Element.hasClassName(el, className) ? '' : ' ' + className;
    el.className = el.className.replace('  ', ' ').replace(/^\s|\s$/, '');

    return el;
  },

  /**
   * Removes a class name from the elements className attribute
   *
   * @param {Element} el        The element to remove class name from
   * @param {String}  className The class name to remove, if it exists
   * @return the element, suitable for method chaining
   */
  removeClassName: function(el, className) {
    var regexp = new RegExp("\\b" + className + "\\b");
    el.className = el.className.replace(regexp, '').replace('  ', ' ').replace(/^\s|\s$/, '');

    return el;
  },

  /**
   * Returns the elements position
   *
   * @param {Element} el The element to find position for
   * @return an object with x and y properties
   */
  position: function(el) {
    var pos = { x: 0, y: 0 };

    while (el !== null) {
      pos.x += el.offsetLeft;
      pos.y += el.offsetTop;
      el = el.offsetParent;
    }

    return pos;
  },

  /**
   * Scroll page to top of element
   *
   * @param {Element} el Element to scroll to
   */
  scrollTo: function(el) {
    var pos = v2.Element.position(el);
    window.scrollTo(pos.x, pos.y);
  }
};

/**
 * Added functionality for functions
 */
v2.Object.extend(Function.prototype, /** @scope Function.prototype */ {
  /**
   * Binds an object to a functions context/this object, and returns a
   * function object. When called the functions this will reference the
   * object it was bound to:
   *
   *   function test() {
   *     alert(this);
   *   }
   *
   *   test(); // Alerts '[object Window]'
   *
   *   var fnObj = test.bind(document);
   *
   *   fnObj(); // Alerts '[object HTMLDocument]'
   *
   * Heavily inspired by:
   *   http://laurens.vd.oever.nl/weblog/items2005/closures/closure.js
   *
   * @param {Object} me            Value for this
   */
   bind: function(me) {
     var fn = this;

     // Creates a closure cache for the function
     fn.__cc = fn.__cc || [];

     // Counts the number of objects bound to this function, effectively
     // creating object ids
     window.__coc = window.__coc || 0;

     // Create id if it doesn't aleady exist
     if (typeof me.__id == 'undefined') {
         me.__id = window.__coc++;
     }

     // Caches the closure unless it's already been cached for this object
     fn.__cc[me.__id] = fn.__cc[me.__id] || function() {
       try {
         return fn.apply(me, arguments);
       } catch(e) {
         // Fail silently...
       }
     };

     // Return cached closure
     return fn.__cc[me.__id];
   }
});

/**
 * Dom content loaded event
 */
if (typeof addDOMLoadEvent != 'undefined') {
  v2.addDOMLoadEvent = addDOMLoadEvent;
}

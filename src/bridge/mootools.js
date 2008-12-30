/**
 * @fileOverview Mootools bridge for validatious
 * @depends ../lib/Base.js
 */
// Global namespace
if (typeof v2 === 'undefined' || v2 === null) {
  v2 = {};
}

/**
 * Checks if a string is undefined, null or empty
 */
v2.empty = function empty(obj) {
  return !$defined(obj) || obj === '';
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
v2.array = $splat;

/**
 * Provides some object level operations.
 */
v2.Object = {
  /**
   * Extend an object safely with some property. If the property is already
   * set, it will not overwrite it.
   *
   * @param {Object}  obj   Source object
   * @param {Object}  props Object literal with properties to add
   * @param {boolean} safe  If true then properties will not be overwritten
   *                        Default is false. Mootools implementation does not
   *                        support this feature
   * @return the extended object
   */
  extend: function(obj, props, safe) {
    var newProps = {};

    for (var p in props) {
      if (typeof props[p] !== 'undefined') {
        newProps[p] = props[p];
      }
    }

    return $extend(obj, newProps);
  }
};

String.prototype.strip = String.prototype.trim;


/**
 * Basically wraps document.getElementById
 *
 * @param {Object} el Id as a string or element
 */
v2.$ = function(el, extend) {
  return $(el);
};

/**
 * Uses Element.getElements (requires the selector engine)
 */
v2.$$ = function $$(query, parent) {
  return $(parent || document).getElements(query);
};

v2.Element = {
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
    return Element.getStyle(el, 'display') != 'none' &&
           Element.getStyle(el, 'visibility') != 'hidden' &&
           (el.parentNode === null ||
            el.parentNode.nodeType != 1 ||
            v2.Element.visible(el.parentNode));
  }
};

v2.Element.observe = Element.addEvent;
v2.Element.computedStyle = Element.getStyle;
v2.Element.previous = Element.getPrevious;
v2.Element.addClassName = Element.addClass;
v2.Element.hasClassName = Element.hasClass;
v2.Element.removeClassName = Element.removeClass;
v2.Element.position = Element.getPosition;
v2.Element.scrollTo = Element.scrollTo;

Element.implement({
  observe: function(event, handler) {
    return this.addEvent(event, handler);
  },

  computedStyle: function(property) {
    return this.getStyle(property);
  },

  previous: function() {
    return this.getPrevious();
  },

  addClassName: function(className) {
    return this.addClass(className);
  },

  hasClassName: function(className) {
    return this.hasClass(className);
  },

  removeClassName: function(className) {
    return this.removeClass(className);
  },

  position: function() {
    return this.getPosition();
  },

  visible: function() {
    return v2.Element.visible(this);
  },

  scrollTo: function(el) {
    var pos = Element.position(el);
    window.scrollTo(pos.x, pos.y);
  }
});

/**
 * Make sure elements returned from Mootools dollar functions have required
 * functionality.
 */
//Element.implement(v2.Element);
Object.extend(v2.Element, Element);

/**
 * Dom content loaded event
 */
v2.addDOMLoadEvent = function(event) {
  window.addEvent('domready', event);
};

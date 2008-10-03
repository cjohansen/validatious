/**
 * @fileOverview Prototype bridge for validatious
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
  if (!v2.empty(data) && data.push) {
    return data;
  }

  data = typeof data == 'string' ? [data] : data;
  var arr = $A(data);

  return !v2.empty(data) && arr.length === 0 ? $A([data]) : arr;
};

/**
 * Fetches the original target for an event
 *
 * @param {Event} e
 * @return {Element} the original target element
 *
 * NB! This relies on proprietary functionality and is discouraged
v2.target = function(e) {
  if (!e) {
    return null;
  }

  return e.explicitOriginalTarget || e.srcElement || e.target || null;
};*/

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
   *                        Default is false. Prototype implementation does not
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

    return Object.extend(obj, newProps);
  }
};

/**
 * Basically wraps document.getElementById
 *
 * @param {Object} el Id as a string or element
 */
v2.$ = function(el, extend) {
  return $(el);
};

/**
 * Uses Element.select
 */
v2.$$ = function $$(query, parent) {
  return Element.select(parent || document, query);
};

v2.Element = {
  /**
   * Delegates to prototypes Element.getStyle
   */
  computedStyle: function(element, property) {
    return Element.getStyle(element, property);
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
    return Element.getStyle(el, 'display') != 'none' &&
           Element.getStyle(el, 'visibility') != 'hidden' &&
           (el.parentNode === null ||
            el.parentNode.nodeType != 1 ||
            Element.visible(el.parentNode));
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
  }
};

Element.addMethods(v2.Element);
Object.extend(v2.Element, Element);

/**
 * Dom content loaded event
 */
v2.addDOMLoadEvent = function(event) {
  document.observe("dom:loaded", event);
};

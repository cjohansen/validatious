/**
 * A field is an abstraction over HTML input controls. A field is what can be
 * considered a single value on an object; either a simple value or an array of
 * values. A field is often represented by a single <label> element and <input>
 * element (or select, textarea) in HTML. In some cases, like radio buttons and
 * checkboxes, a single field can be represented by several HTML controls.
 *
 * The v2.FieldElement interface provides a consistent way of interfacing with
 * these controls as a single unit.
 */
v2.FieldElement = new v2.Interface('v2.FieldElement', [

  /**
   * Returns the value of the field as a string (for single value fields) or
   * array (for multi value fields, such as checkboxes)
   *
   * @return {Array/String} a string or an array of strings
   */
  'getValue',

  /**
   * Returns the label element associated with the field. In many cases this is
   * a <label> element, but for some fields (such as radio buttons) where the
   * field consists of several input/label pairs, this method may return another
   * element type that acts as a label/heading for the field as a whole.
   *
   * @return {Element} the label (or "label like") element
   */
  'getLabel',

  /**
   * Returns the field name as a string. This value is usually retrieved from
   * the text inside the label element for this field. If the label element has
   * a title attribute, this should be preferred. In case no label is found, the
   * id of one of the elements for the field is returned. When no id is
   * available, the name attribute is returned instead.
   *
   * The preceding algorithm can be overriden by ways of setting the name
   * explicitly through the setName method.
   *
   * @return {String} the field name
   */
  'getName',

  /**
   * Forces a name for a field, bypassing the algorithm described in getName().
   * When a name is set with this method it will be returned by getName() until
   * it is cleared by calling this method with a falsy value.
   *
   * @param {String} name The name of the field
   * @return {v2.FieldElement} this object, suitable for chaining
   */
  'setName',

  /**
   * Returns encapsulating parent element for the field. Note that this may or
   * may not be the direct parent of an element in the field. Usually, this
   * represents the logical container for the whole field.
   *
   * @return {Element} the parent element
   */
  'getParent',

  /**
   * Returns the actual elements that make up this field
   *
   * @return {NodeList} the list of elements. Note that the return value may in
   *                    some implementations actually be an array, noe a live
   *                    node list. However, an array can not be assumed.
   */
  'getElements',

  /**
   * Returns true if a field is visible. A field is considered visible if any of
   * it's elements are visible. If the parent element is invisible, the field is
   * considered invisible, even if the field is configured in such a way that
   * all elements aren't contained in the parent element.
   *
   * @return {boolean} true if the field is visible (the user can interact with
   *                   it)
   */
  'visible']
);

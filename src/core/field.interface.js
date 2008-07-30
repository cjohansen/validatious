/**
 * A field is an abstraction over HTML input controls. A field is what can be
 * considered a single value on an object; either a simple value or an array of
 * values. A field is often represented by a single <label> element and <input>
 * element (or select, textarea) in HTML. In some cases, like radio buttons and
 * checkboxes, a single field can be represented by several HTML controls.
 *
 * The v2.Field interface provides a consistent way of interfacing with these
 * controls as a single unit.
 */
v2.Field = new v2.Interface('v2.Field', [

  /**
   *
   */
  'value',

  /**
   *
   */
  'label',

  /**
   *
   */
  'name',

  /**
   *
   */
  'parent']
);

/**
 * Defines methods for a form item that knows how to validate its contents
 */
v2.FormItem = new v2.Interface('v2.FormItem', [

  /**
   * Validates the items contents. Runs the test method to check if the
   * component is valid. If it is, error messages are cleared and the onSuccess
   * callback is invoked.
   *
   * If the component is found invalid, the list of invalid fields are set and
   * finally the onFailure callback is invoked.
   */
  'validate',

  /**
   * Checks if the component is valid. Populates the error list returned by
   * getInvalid when component is inalid.
   *
   * If exceptions are added through the addException method then the test will
   * not be run if all exceptions pass or fails as expected.
   *
   * @param {String} methodName The method to invoke on children elements. This
   *                            defaults to test, but may also be validate
   */
  'test',

  /**
   * Returns a list of invalid child objects. This method returns null when
   * test() returns true.
   */
  'getInvalid',

  /**
   * Sets a message for this component. By setting this message the messages
   * for each individual child object is overriden. If the form item is a
   * fieldset, setting this message will cause only this message to be returned
   * when the fields in the fieldset fail validation (as opposed to indiviual
   * messages per field).
   *
   * Setting this property for a field will cause the message to be returned any
   * time the field fails, regardless of which validator caused the failure.
   */
  'setMessage',

  /**
   * Callback that is called from validate() when the component fails validation
   */
  'onFailure',

  /**
   * Callback that is called from validate() when the component passes validation
   */
  'onSuccess',

  /**
   * Decides whether or not all child objects need to pass validation. If this
   * method returns true then the component will pass validation if one or more
   * child objects pass validation. If it returns true, all child objects must
   * pass for the component to pass.
   *
   * If a parameter i passed in, the internal state is set to this
   */
  'passOnAny',

  /**
   * Returns an array of error messages generated for this component. If the
   * setMessage method has been called then this method will return an array
   * with a single message - the message set through setMessage. Otherwise it
   * will return an array of messages from failing child objects. Call
   * getInvalid to get a hold of the actual objects that failed.
   */
   'getMessages'/*,

  /*
   * Adds an exception. The flag decides if the exception is expected to be
   * valid or invalid. The exception is tested when the component is validated
   * (or tested), and the test will not be run if all exceptions pass.
   *
   * @param {v2.FormItem + v2.Composite} item
   * @param {boolean} flag If true, item should pass, if false it should fail
   *
  'addException'*/]
);

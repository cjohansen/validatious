// Global namespace
if (typeof v2 == 'undefined' || v2 === null) {
  v2 = {};
}

if (typeof v2.Messages == 'undefined' || v2.Messages === null) {
  /**
   * English default error messages
   */
  v2.Messages = {
    minLength: '${field} should be atleast ${min} characters long',
    maxLength: '${field} should be no more than ${max} characters long',
    minVal: '${field} should be atleast ${min}',
    maxVal: '${field} should be no bigger than ${min}',
    email: '${field} should be a valid email address',
    alpha: '${field} should only contain letters',
    numeric: '${field} should only contain numbers',
    alphaNum: '${field} should only contain letters and numbers',
    url: '${field} should be a valid URL',
    phoneNor: '${field} should be a valid norwegian phone number',
    autoRegNumNor: '${field} should be a valid norwegian auto registration number',
    required: '${field} is required',
    ssnNor: '${field} should be a valid norwegian social security number'
  };
}

// Global namespace
if (typeof v2 == 'undefined' || v2 === null) {
  v2 = {};
}

if (typeof v2.Messages == 'undefined' || v2.Messages === null) {
  /**
   * Norwegian default error messages
   */
  v2.Messages = {
    minLength: '${field} må være minst ${min} tegn',
    maxLength: '${field} kan ikke være lengre enn ${max} tegn',
    minVal: '${field} må være minst ${min}',
    maxVal: '${field} kan ikke være større enn ${min}',
    email: '${field} må være en gyldig e-postadresse',
    alpha: '${field} skal bare inneholde bokstaver',
    numeric: '${field} skal bare inneholde tall',
    alphaNum: '${field} skal bare inneholde tall og bokstaver',
    url: '${field} må være en gyldig URL',
    phoneNor: '${field} må være et gyldig norskt telefonnummer',
    autoRegNumNor: '${field} må være et gyldig bilskiltnummer',
    required: '${field} er påkrevd',
    ssnNor: '${field} må være et gyldig personnummer'
  };
}

/**
 * @fileoverview JSON wrapper methods for older browsers.
 */




  var json = {},
      debug = require('./debug'),
      nativeJSON = window.JSON;

  /**
   * Parse JSON and return the object
   *
   * @param {!string} str
   * @return {*}
   */
  json.parse = function(str) {
    return nativeJSON.parse(str);
  };

  /**
   * Convert a value into JSON
   *
   * @param {*} val
   * @return {!string}
   */
  json.stringify = function(val) {
    return nativeJSON.stringify(val);
  };
  module.exports = json;

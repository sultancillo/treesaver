/**
 * @fileoverview JSON wrapper methods for older browsers.
 */
treesaver = treesaver || {};
treesaver.json = treesaver.json || {};


require('./debug');


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


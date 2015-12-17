/**
 * @fileoverview Helper functions for manipulating arrays.
 */

treesaver = treesaver || {};
treesaver.array = treesaver.array || {};



  var array = treesaver.array;

  if (!'isArray' in Array) {
    /**
     * Test Array-ness.
     *
     * @param {*} arr
     * @return {boolean}
     * NOTE: Suppress warnings about duplication from built-in externs.
     * @suppress {duplicate}
     */
    Array.isArray = function(arr) {
      return Object.prototype.toString.apply(/** @type {Object} */(arr)) ===
        '[object Array]';
    };
  }

  /**
   * Convert array-like things to an array
   *
   * @param {*} obj
   * @return {!Array}
   */
  treesaver.array.toArray = function(obj) {
    return Array.prototype.slice.call(/** @type {Object} */(obj), 0);
  };

  /**
   * Remove an index from an array
   * By John Resig (MIT Licensed)
   *
   * @param {!Array} arr
   * @param {!number} from
   * @param {number=} to
   */
  treesaver.array.remove = function(arr, from, to) {
    var rest = arr.slice((to || from) + 1 || arr.length);
    arr.length = from < 0 ? arr.length + from : from;
    return arr.push.apply(arr, rest);
  };
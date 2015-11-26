/**
 * @fileoverview CSS helper functions.
 */



/**
 * Return the computedStyle object, which varies based on
 * browsers
 * @param {?Element} el
 * @return {Object}
 */
module.exports.getStyleObject = function(el) {
  return document.defaultView.getComputedStyle(el, null);
};

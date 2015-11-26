/**
 * @fileoverview String helper functions.
 */

if (!'trim' in String.prototype) {
  String.prototype.trim = function() {
    return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
  };
}

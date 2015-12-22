
treesaver = treesaver || {};
treesaver.layout = treesaver.layout || {};
treesaver.layout.ContentPosition = treesaver.layout.ContentPosition || {};


/**
 * Helper class for indicating a relative position within a
 * stream of content
 *
 * @constructor
 * @param {number} block Index of the current block.
 * @param {number} figure Index of the current figure.
 * @param {number} overhang Overhang.
 */
treesaver.layout.ContentPosition = function(block, figure, overhang) {
  this.block = block;
  this.figure = figure;
  this.overhang = overhang;
};




  /**
   * @type {number}
   */
  treesaver.layout.ContentPosition.prototype.block;

  /**
   * @type {number}
   */
  treesaver.layout.ContentPosition.prototype.figure;

  /**
   * @type {number}
   */
  treesaver.layout.ContentPosition.prototype.overhang;

  /**
   * Position at the end of content
   *
   * @const
   * @type {!treesaver.layout.ContentPosition}
   */
  treesaver.layout.ContentPosition.END =
    new treesaver.layout.ContentPosition(Infinity, Infinity, Infinity);

  /**
   * Is the current content position at the beginning?
   *
   * @return {boolean} True if at beginning of content.
   */
  treesaver.layout.ContentPosition.prototype.atBeginning = function() {
    return !this.block && !this.figure && !this.overhang;
  };

  /**
   * Sort function for ContentPositions
   *
   * @param {!treesaver.layout.ContentPosition} a
   * @param {!treesaver.layout.ContentPosition} b
   * @return {number} Negative if b is greater, 0 if equal, positive if be is lesser.
   */
  treesaver.layout.ContentPosition.sort = function(a, b) {
    if (a.block !== b.block) {
      return b.block - a.block;
    }
    else if (a.overhang !== b.overhang) {
      // Less overhang = further along
      return a.overhang - b.overhang;
    }

    return b.figure - a.figure;
  };

  /**
   * @param {!treesaver.layout.ContentPosition} other
   * @return {boolean} True if the other breakRecord is ahead of this one.
   */
  treesaver.layout.ContentPosition.prototype.lessOrEqual = function(other) {
    return treesaver.layout.ContentPosition.sort(this, other) >= 0;
  };

  /**
   * @param {!treesaver.layout.ContentPosition} other
   * @return {boolean} True if the other breakRecord is behind this one.
   */
  treesaver.layout.ContentPosition.prototype.greater = function(other) {
    return treesaver.layout.ContentPosition.sort(this, other) < 0;
  };

  /**
   * Clone the ContentPosition
   * TODO: Was DEBUG only?
   *
   * @return {!treesaver.layout.ContentPosition}
   */
  treesaver.layout.ContentPosition.prototype.clone = function() {
    return new this.constructor(this.block, this.figure, this.overhang);
  };


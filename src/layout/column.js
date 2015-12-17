/**
 * @fileoverview Column data structure.
 */

treesaver = treesaver || {};
treesaver.layout = treesaver.layout || {};
treesaver.layout.Column = treesaver.layout.Column || {};

require('./lib/dimensions');
require('./lib/dom');


  /**
   * A column within a grid
   *
   * @constructor
   * @param {!Element} el         HTML element.
   * @param {number}   gridHeight The height of the grid that contains this column.
   */
  treesaver.layout.Column = function(el, gridHeight) {
    var d = new treesaver.dimensions.Metrics(el);

    this.flexible = !treesaver.dom.hasClass(el, 'fixed');

    this.minH = d.minH;

    // Need to clear the minHeight, if there is one, in order to get an accurate
    // delta reading
    if (this.minH) {
      treesaver.dimensions.setCssPx(el, 'minHeight', 0);
    }

    this.h = d.outerH;
    this.w = d.outerW;

    this.delta = Math.max(0, gridHeight - this.h);
  };


  /**
   * @type {boolean}
   */
  treesaver.layout.Column.prototype.flexible;

  /**
   * @type {number}
   */
  treesaver.layout.Column.prototype.minH;

  /**
   * @type {number}
   */
  treesaver.layout.Column.prototype.h;

  /**
   * @type {number}
   */
  treesaver.layout.Column.prototype.delta;

  /**
   * @param {number} gridHeight
   * @return {!treesaver.layout.Column} Returns self for chaining support.
   */
  treesaver.layout.Column.prototype.stretch = function(gridHeight) {
    if (!this.flexible) {
      return this;
    }

    this.h = Math.max(0, gridHeight - this.delta);

    return this;
  };

  if (goog.DEBUG) {
    treesaver.layout.Column.prototype.toString = function() {
      return '[Column ' + this.h + '/' + this.delta + ']';
    };
  }


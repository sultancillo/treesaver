/**
 * @fileoverview Container data structure.
 */

treesaver = treesaver || {};
treesaver.layout = treesaver.layout || {};
treesaver.layout.Container = treesaver.layout.Container || {};


require('./lib/dimensions');
require('./lib/dom');




  /**
   * A column within a grid
   *
   * @constructor
   * @param {!Element} el         HTML element.
   * @param {number}   gridHeight The height of the grid that contains this container.
   */
  treesaver.layout.Container = function(el, gridHeight) {
    var d = new treesaver.dimensions.Metrics(el);

    this.flexible = !treesaver.dom.hasClass(el, 'fixed');

    this.minH = d.minH;

    // Need to clear the minHeight, if there is one, in order to get an accurate
    // delta reading
    if (this.minH) {
      treesaver.dimensions.setCssPx(el, 'minHeight', 0);
    }

    this.h = d.outerH;

    this.delta = Math.max(0, gridHeight - this.h);

    var sizesProperty = el.getAttribute('data-sizes');

    /**
     * @type {!Array.<string>}
     */
    this.sizes = sizesProperty ? sizesProperty.split(' ') : [];
  };



  /**
   * @type {boolean}
   */
  treesaver.layout.Container.prototype.flexible;

  /**
   * @type {number}
   */
  treesaver.layout.Container.prototype.minH;

  /**
   * @type {number}
   */
  treesaver.layout.Container.prototype.h;

  /**
   * @type {number}
   */
  treesaver.layout.Container.prototype.delta;

  /**
   * @type {!Array.<string>}
   */
  treesaver.layout.Container.prototype.sizes;

  /**
   * @param {number} gridHeight
   * @return {!treesaver.layout.Container} Returns self for chaining support.
   */
  treesaver.layout.Container.prototype.stretch = function(gridHeight) {
    if (!this.flexible) {
      return this;
    }

    this.h = Math.max(0, gridHeight - this.delta);

    return this;
  };

  if (goog.DEBUG) {
    treesaver.layout.Container.prototype.toString = function() {
      return '[Container ' + this.h + '/' + this.delta + ']';
    };
  }


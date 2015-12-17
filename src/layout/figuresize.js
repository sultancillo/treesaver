/**
 * @fileoverview HTML and other information about a figure's content payload.
 */

treesaver = treesaver || {};
treesaver.layout = treesaver.layout || {};
treesaver.layout.FigureSize = treesaver.layout.FigureSize || {};


require('../lib/dom');

/**
 * HTML and other information about a figure content payload
 * @param {string} html Content payload.
 * @param {number|string} minW
 * @param {number|string} minH
 * @param {?Array.<string>} requirements
 * @constructor
 */
treesaver.layout.FigureSize = function(html, minW, minH, requirements) {
  this.html = html;

  // TODO: Use outerHTML from the node eventually in order to sanitize bad
  // HTML?

  // Provide a rough measure the element so we know if we can fit within
  // containers
  this.minW = parseInt(minW || 0, 10);
  this.minH = parseInt(minH || 0, 10);

  // TODO: Only store mutable capabilities
  this.requirements = requirements;
};




  /**
   * The full HTML content for this payload.
   *
   * @type {string}
   */
  treesaver.layout.FigureSize.prototype.html;

  /**
   * @type {number}
   */
  treesaver.layout.FigureSize.prototype.minW;

  /**
   * @type {number}
   */
  treesaver.layout.FigureSize.prototype.minH;

  /**
   * List of required capabilities for this Chrome
   *
   * @type {?Array.<string>}
   */
  treesaver.layout.FigureSize.prototype.requirements;

  /**
   * @return {boolean} True if the figureSize meets current browser capabilities.
   */
  treesaver.layout.FigureSize.prototype.meetsRequirements = function() {
    if (!this.requirements) {
      return true;
    }

    return treesaver.capabilities.check(this.requirements, true);
  };

  /**
   * Apply the figure size to the element
   * @param {!Element} container
   * @param {string=} name
   */
  treesaver.layout.FigureSize.prototype.applySize = function(container, name) {
    if (name) {
      treesaver.dom.addClass(container, name);
    }

    container.innerHTML = this.html;

    // Find any cloaked images
    treesaver.dom.querySelectorAll('img[data-src], iframe[data-src], video[data-src], source[data-src], audio[data-src]', container).forEach(function(e) {
      e.setAttribute('src', e.getAttribute('data-src'));
    });
  };

  /**
   * Back out an applied figure size after a failure
   * @param {!Element} container
   */
  treesaver.layout.FigureSize.prototype.revertSize = function(container, name) {
    // Remove class
    treesaver.dom.removeClass(container, name);
    // Remove content
    treesaver.dom.clearChildren(container);
  };

  if (goog.DEBUG) {
    // Expose for testing
    treesaver.layout.FigureSize.prototype.toString = function() {
      return '[FigureSize: ' + this.index + '/' + this.html + ']';
    };
  }


/**
 * @fileoverview The lightbox class.
 */

treesaver = treesaver || {};
treesaver.ui = treesaver.ui || {};
treesaver.ui.LightBox = treesaver.ui.LightBox || {};

require('../lib/capabilities');
require('../lib/debug');
require('../lib/dimensions');
require('../lib/dom');
require('../ui/scrollable');


  /**
   * LightBox
   *
   * @param {!Element} node HTML node.
   * @constructor
   */
  treesaver.ui.LightBox = function(node) {
    var containerNode = treesaver.dom.querySelectorAll('.container', node)[0];

    // DEBUG-only validation
    if (goog.DEBUG) {
      if (!containerNode) {
        treesaver.debug.error('No container within lightbox!');
      }
    }

    // TODO: Only store mutable capabilities
    this.requirements = treesaver.dom.hasAttr(node, 'data-requires') ?
      node.getAttribute('data-requires').split(' ') : null;

    this.html = node.parentNode.innerHTML;

    this.size = new treesaver.dimensions.Metrics(node);

    // Clean up metrics object
    delete this.size.w;
    delete this.size.h;
  };



  var LightBox = treesaver.ui.LightBox,
      capabilities = treesaver.capabilities,
      debug = treesaver.debug,
      dimensions = treesaver.dimensions,
      dom = treesaver.dom,
      Scrollable = treesaver.ui.Scrollable;

  /**
   * List of required capabilities for this LightBox
   *
   * @type {?Array.<string>}
   */
  treesaver.ui.LightBox.prototype.requirements;

  /**
   * @type {string}
   */
  treesaver.ui.LightBox.prototype.html;

  /**
   * The measurements of the chrome
   * @type {!treesaver.dimensions.Metrics}
   */
  treesaver.ui.LightBox.prototype.size;

  /**
   * @type {boolean}
   */
  treesaver.ui.LightBox.prototype.active;

  /**
   * @type {?Element}
   */
  treesaver.ui.LightBox.prototype.node;

  /**
   * @type {?Element}
   */
  treesaver.ui.LightBox.prototype.container;

  /**
   * @return {!Element} The activated node.
   */
  treesaver.ui.LightBox.prototype.activate = function() {
    if (!this.active) {
      this.active = true;

      this.node = treesaver.dom.createElementFromHTML(this.html);
      this.container = treesaver.dom.querySelectorAll('.container', this.node)[0];
    }

    return /** @type {!Element} */ (this.node);
  };

  /**
   * Deactivate the lightbox
   */
  treesaver.ui.LightBox.prototype.deactivate = function() {
    if (!this.active) {
      return;
    }

    this.active = false;

    // Make sure to drop references
    this.node = null;
  };

  /**
   * The maximum available space within the lightbox right now
   *
   * @return {!treesaver.dimensions.Size}
   */
  treesaver.ui.LightBox.prototype.getMaxSize = function() {
    if (goog.DEBUG) {
      if (!this.node || !this.container) {
        treesaver.debug.error('No active container for lightbox');
      }
    }

    // Compiler cast
    this.container = /** @type {!Element} */ (this.container);

    // TODO: Query only needed properties
    var metrics = new treesaver.dimensions.Metrics(this.container);

    return {
      w: metrics.w,
      h: metrics.h
    };
  };


  /**
   * @param {!treesaver.layout.Figure} figure
   */
  treesaver.ui.LightBox.prototype.showFigure = function(figure) {
    var containerSize = this.getMaxSize(),
        largest = figure.getLargestSize(containerSize, true),
        screenW = treesaver.dimensions.getOffsetWidth(this.container.offsetParent),
        screenH = treesaver.dimensions.getOffsetHeight(this.container.offsetParent),
        scrollNode,
        contentW, contentH, metrics;

    // TODO: Provide name for sizing via CSS?

    // Closure compiler cast
    this.container = /** @type {!Element} */ (this.container);

    if (this.active && largest) {
      largest.figureSize.applySize(this.container, largest.name);
      this.container.style.bottom = 'auto';
      this.container.style.right = 'auto';

      // What's the size of the content?
      // TODO: Refactor to query only needed properties
      metrics = new treesaver.dimensions.Metrics(this.container);
      contentW = metrics.w;
      contentH = metrics.h;

      // Clamp in case of scrolling
      if (figure.scrollable) {
        contentW = Math.min(containerSize.w, contentW);
        contentH = Math.min(containerSize.h, contentH);
        treesaver.dimensions.setCssPx(this.container, 'width', contentW);
        treesaver.dimensions.setCssPx(this.container, 'height', contentH);
        treesaver.dom.addClass(this.container, 'scroll');
        treesaver.ui.Scrollable.initDom(this.container);
      }

      // Center the container on the screen (use offsetWidth to include border/padding)
      treesaver.dimensions.setCssPx(this.container, 'left', (screenW - contentW - metrics.bpWidth) / 2);
      treesaver.dimensions.setCssPx(this.container, 'top', (screenH - contentH - metrics.bpHeight) / 2);
      return true;
    }
    else {
      return false;
    }
  };

  /**
   * @param {treesaver.dimensions.Size} availSize
   * @return {boolean} True if fits.
   */
  treesaver.ui.LightBox.prototype.fits = function(availSize) {
    return treesaver.dimensions.inSizeRange(this.size, availSize);
  };

  /**
   * @return {boolean} True if the LightBox meets current browser capabilities.
   */
  treesaver.ui.LightBox.prototype.meetsRequirements = function() {
    if (!this.requirements) {
      return true;
    }

    return treesaver.capabilities.check(this.requirements, true);
  };

  /**
   * Find the first lightbox that meets the current requirements
   *
   * @param {Array.<treesaver.ui.LightBox>} lightboxes
   * @param {treesaver.dimensions.Size} availSize
   * @return {?treesaver.ui.LightBox} A suitable LightBox, if one was found.
   */
  treesaver.ui.LightBox.select = function(lightboxes, availSize) {
    // Cycle through lightboxes
    var i, len, current, lightbox = null;

    for (i = 0, len = lightboxes.length; i < len; i += 1) {
      current = lightboxes[i];
      if (current.meetsRequirements() && current.fits(availSize)) {
        lightbox = current;
        break;
      }
    }

    if (!lightbox) {
      treesaver.debug.error('No LightBox Fits!');
    }

    return lightbox;
  };


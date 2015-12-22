/**
 * @fileoverview Helpers for measuring elements.
 */
treesaver = treesaver || {}
treesaver.dimensions = treesaver.dimensions || {};



require('./capabilities');
require('./css');
require('./debug');




  /**
   * Alias for Size type
   *
   * @typedef {{ w: number, h: number }}
   */
  treesaver.dimensions.Size;

  /**
   * Alias for SizeRange type
   *
   * @typedef {{ w: number, h: number, maxW: number, maxH: number }}
   */
  treesaver.dimensions.SizeRange;

  /**
   * Regex to determine whether a value is a pixel value.
   * @private
   */
  treesaver.dimensions.pixel = /^-?\d+(:?\.\d+)?(?:px)?$/i;


  /**
   * Regex to determine whether a value contains a number.
   * @private
   */
  treesaver.dimensions.number = /^-?\d(:?\.\d+)?/;

  /**
   * Round fractional widths to 1/round_to.
   * @private
   */
  treesaver.dimensions.round_to = 1000;

  /**
   * Whether the given size fits within the bounds set by the range
   *
   * @param {treesaver.dimensions.SizeRange|treesaver.dimensions.Metrics} range
   * @param {treesaver.dimensions.Size} size
   * @return {boolean} True if both dimensions are within the min and max.
   */
  treesaver.dimensions.inSizeRange = function(range, size) {
    if (!range) {
      return false;
    }

    // Use minW/minH for Metrics, w/h for a range
    // TODO: Make this consistent
    var w = (range.minW || range.minW === 0) ? range.minW : range.w,
        h = (range.minH || range.minH === 0) ? range.minH : range.h;

    return size.w >= w && size.h >= h &&
      size.w <= range.maxW && size.h <= range.maxH;
  };

  /**
   *
   * @param {treesaver.dimensions.SizeRange} range
   * @param {treesaver.dimensions.Metrics} metrics
   * @param {boolean} outer
   * @return {treesaver.dimensions.SizeRange}
   */
  treesaver.dimensions.mergeSizeRange = function(range, metrics, outer) {
    var a = range || {},
        b = metrics || {};

    var bpHeight = outer ? b.bpHeight || (b.outerH ? b.outerH - b.h : 0) : 0,
        bpWidth = outer ? b.bpWidth || (b.outerW ? b.outerW - b.w : 0) : 0;

    return {
      w: Math.max(a.w || 0, (b.w + bpWidth) || 0),
      h: Math.max(a.h || 0, (b.h + bpHeight) || 0),
      maxW: Math.min(a.maxW || Infinity, b.maxW + bpWidth || Infinity),
      maxH: Math.min(a.maxH || Infinity, b.maxH + bpHeight || Infinity)
    };
  };

  /**
   * Convert a string value to pixels
   *
   * @param {!Element} el
   * @param {?string} val
   * @return {?number} Value in pixels.
   */
  treesaver.dimensions.toPixels = function(el, val) {
    if (val && treesaver.dimensions.pixel.test(val)) {
      return parseFloat(val) || 0;
    }
    return null;
  };

  /**
   * Return the width and height element in a simple object
   *
   * @param {Element} el
   * @return {!treesaver.dimensions.Size}
   */
  treesaver.dimensions.getSize = function(el) {
    return {
      w: treesaver.dimensions.getOffsetWidth(el),
      h: treesaver.dimensions.getOffsetHeight(el)
    };
  };

  /**
   * Return the offsetHeight of the element.
   *
   * @param {?Element} el
   * @return {!number} Value in pixels.
   */
  treesaver.dimensions.getOffsetHeight = function(el) {
    return el && el.offsetHeight || 0;
  };

  /**
   * Return the offsetWidth of the element.
   *
   * @param {?Element} el
   * @return {!number} Value in pixels.
   */
  treesaver.dimensions.getOffsetWidth = function(el) {
    return el && (Math.round(el.getBoundingClientRect()['width'] * treesaver.dimensions.round_to) / treesaver.dimensions.round_to) || 0;
  };

  /**
   * Return the offsetTop of the element.
   *
   * @param {?Element} el
   * @return {!number} Value in pixels.
   */
  treesaver.dimensions.getOffsetTop = function(el) {
    return el && el.offsetTop || 0;
  }

  /**
   * Helper for setting a CSS value in pixels
   *
   * @param {!Element} el
   * @param {!string} propName
   * @param {!number} val
   * @return {!number} The value supplied.
   */
  treesaver.dimensions.setCssPx = function(el, propName, val) {
    el.style[propName] = val + 'px';

    return val;
  };

  /**
    * Helper for setting the transform property on an element
    *
    * @param {!Element} el
    * @param {!string} val
    */
  treesaver.dimensions.setTransformProperty_ = function(el, val) {
    // TODO: Detect once
    if ('transformProperty' in el.style) {
      el.style['transformProperty'] = val;
    }
    else {
      el.style[treesaver.capabilities.domCSSPrefix + 'Transform'] = val;
    }
  };

  /**
   * Clear out any offset
   *
   * @param {!Element} el
   */
  treesaver.dimensions.clearOffset = function(el) {
    treesaver.dimensions.setTransformProperty_(el, 'none');
  };

  /**
   * Helper for setting the offset on an element, using CSS transforms if
   * supported, absolute positioning if not
   *
   * @param {!Element} el
   * @param {!number} x
   * @param {!number} y
   */
  treesaver.dimensions.setOffset = function(el, x, y) {
    treesaver.dimensions.setTransformProperty_(el,
      'translate(' + x + 'px,' + y + 'px)');
  };

  // Use hw-accelerated 3D transforms if present
  if (treesaver.capabilities.SUPPORTS_CSSTRANSFORMS3D) {
    treesaver.dimensions.setOffset = function(el, x, y) {
      treesaver.dimensions.setTransformProperty_(el,
        'translate3d(' + x + 'px,' + y + 'px,0)');
    };
  }

  /**
   * Helper for setting the x-offset on an element
   *
   * @param {!Element} el
   * @param {!number} x
   */
  treesaver.dimensions.setOffsetX = function(el, x) {
    treesaver.dimensions.setOffset(el, x, 0);
  };

  /**
   * Round up to the nearest multiple of the base number
   *
   * @param {!number} number
   * @param {!number} base
   * @return {number} A multiple of the base number.
   */
  treesaver.dimensions.roundUp = function(number, base) {
    return Math.ceil(number) + base - Math.ceil(number % base);
  };

  /**
   * The style dimensions of an element including margin, border, and
   * padding as well as line height
   *
   * @constructor
   * @param {!Element=} el
   */
  treesaver.dimensions.Metrics = function(el) {
    if (!el) {
      return;
    }

    var style = treesaver.css.getStyleObject(el),
        oldPosition = el.style.position,
        oldStyleAttribute = el.getAttribute('style'),
        tmp;

    this.display = style.display;
    this.position = style.position;

    // Webkit gives incorrect right margins for non-absolutely
    // positioned elements
    //if (this.position !== 'absolute') {
      //el.style.position = 'absolute';
    //}
    // Disable this for now, as it can give incorrect formatting
    // for elements in the flow
    // Also: Getting computed style is kinda silly if we change the
    // styling -- may affect the measurements anyway

    // Margin
    this.marginTop = treesaver.dimensions.toPixels(el, style.marginTop) || 0;
    this.marginBottom = treesaver.dimensions.toPixels(el, style.marginBottom) || 0;
    this.marginLeft = treesaver.dimensions.toPixels(el, style.marginLeft) || 0;
    this.marginRight = treesaver.dimensions.toPixels(el, style.marginRight) || 0;
    // Summed totals
    this.marginHeight = this.marginTop + this.marginBottom;
    this.marginWidth = this.marginLeft + this.marginRight;

    // Border
    this.borderTop = treesaver.dimensions.toPixels(el, style.borderTopWidth);
    this.borderBottom = treesaver.dimensions.toPixels(el, style.borderBottomWidth);
    this.borderLeft = treesaver.dimensions.toPixels(el, style.borderLeftWidth);
    this.borderRight = treesaver.dimensions.toPixels(el, style.borderRightWidth);

    // Padding
    this.paddingTop = treesaver.dimensions.toPixels(el, style.paddingTop);
    this.paddingBottom = treesaver.dimensions.toPixels(el, style.paddingBottom);
    this.paddingLeft = treesaver.dimensions.toPixels(el, style.paddingLeft);
    this.paddingRight = treesaver.dimensions.toPixels(el, style.paddingRight);

    // Summed totals for border & padding
    this.bpTop = this.borderTop + this.paddingTop;
    this.bpBottom = this.borderBottom + this.paddingBottom;
    this.bpHeight = this.bpTop + this.bpBottom;
    this.bpLeft = this.borderLeft + this.paddingLeft;
    this.bpRight = this.borderRight + this.paddingRight;
    this.bpWidth = this.bpLeft + this.bpRight;

    // Outer Width & Height
    this.outerW = treesaver.dimensions.getOffsetWidth(el);
    this.outerH = treesaver.dimensions.getOffsetHeight(el);

    // Inner Width & Height
    this.w = this.outerW - this.bpWidth;
    this.h = this.outerH - this.bpHeight;

    // Min & Max : Width & Height
    this.minW = treesaver.dimensions.toPixels(el, style.minWidth) || 0;
    this.minH = treesaver.dimensions.toPixels(el, style.minHeight) || 0;

    // Opera returns -1 for a max-width or max-height that is not set.
    tmp = treesaver.dimensions.toPixels(el, style.maxWidth);
    this.maxW = (!tmp || tmp === -1) ? Infinity : tmp;

    tmp = treesaver.dimensions.toPixels(el, style.maxHeight);
    this.maxH = (!tmp || tmp === -1) ? Infinity : tmp;

    // Line height
    this.lineHeight = treesaver.dimensions.toPixels(el, style.lineHeight) || null;

    // Restore the original position property on style
    //if (this.position !== 'absolute') {
      //el.style.position = oldPosition;
      //if (!el.getAttribute('style')) {
        //el.removeAttribute('style');
      //}
    //}
  };

  /**
   * Make a copy of the object
   *
   * @return {!treesaver.dimensions.Metrics}
   */
  treesaver.dimensions.Metrics.prototype.clone = function() {
    var copy = new treesaver.dimensions.Metrics(),
        key;

    for (key in this) {
      if (copy[key] !== this[key]) {
        copy[key] = this[key];
      }
    }

    return copy;
  };

  // TODO: MergeSizeRange

  if (goog.DEBUG) {
    treesaver.dimensions.Metrics.prototype.toString = function() {
      return '[Metrics: ' + this.w + 'x' + this.h + ']';
    };
  }


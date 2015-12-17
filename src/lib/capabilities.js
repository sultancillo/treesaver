/**
 * @fileoverview Capability testing and tracking library.
 *
 */
treesaver = treesaver || {};
treesaver.capabilities = treesaver.capabilities || {};


require('../lib/array'); // array.some
require('../lib/constants');
// Avoid circular dependency
// require('./lib/network');




  /**
   * Cached value of browser user agent
   *
   * @const
   * @private
   * @type {string}
   */
  treesaver.capabilities.ua_ = window.navigator.userAgent.toLowerCase();

  /**
   * Cached value of browser platform
   *
   * @const
   * @private
   * @type {string}
   */
  treesaver.capabilities.platform_ =
    // Android 1.6 doesn't have a value for navigator.platform
    window.navigator.platform ?
    (/Linux armv[5-9]/.test(window.navigator.platform) ? 'android' : window.navigator.platform.toLowerCase()) :
    /android/.test(treesaver.capabilities.ua_) ? 'android' : 'unknown';

  /**
   * Does the current browser meet the Treesaver requirements
   *
   * @const
   * @type {boolean}
   */
  treesaver.capabilities.SUPPORTS_TREESAVER = (
    // Can't be in quirks mode (box model issues)
    document.compatMode !== 'BackCompat' &&
    // Need W3C AJAX (excludes IE6)
    'XMLHttpRequest' in window &&
    // W3C event model (excludes IE8 and below)
    'addEventListener' in document &&
    // Runtime styles (needed for measuring)
    'getComputedStyle' in window &&
    // querySelectorAll
    'querySelectorAll' in document &&
    // Local storage
    'localStorage' in window &&
    // JSON
    'JSON' in window
  );

  /**
   * Are we running within a native app?
   *
   * @const
   * @type {boolean}
   */
  treesaver.capabilities.IS_NATIVE_APP = WITHIN_IOS_WRAPPER ||
    !!window.TS_WITHIN_NATIVE_IOS_APP;

  /**
   * Is the browser running on a mobile device?
   *
   * @const
   * @type {boolean}
   */
  treesaver.capabilities.IS_MOBILE = treesaver.capabilities.IS_NATIVE_APP ||
    treesaver.capabilities.BROWSER_OS === 'android' ||
    /mobile/.test(treesaver.capabilities.ua_);

  /**
   * Does the device have a small screen?
   *
   * @const
   * @type {boolean}
   */
  treesaver.capabilities.IS_SMALL_SCREEN =
    window.screen.width <= 600;

  /**
   * Name of the current browser. Possible values:
   *   - msie
   *   - chrome
   *   - safari
   *   - webkit
   *   - mozilla
   *   - opera
   *   - unknown
   *
   * @const
   * @type {string}
   */
  treesaver.capabilities.BROWSER_NAME = (function() {
    if (treesaver.capabilities.IS_NATIVE_APP) {
      return 'safari';
    }

    // TODO: This code is all terrible
    // Luckily it runs only once
    if (/webkit/.test(treesaver.capabilities.ua_)) {
      if (/chrome|safari/.test(treesaver.capabilities.ua_)) {
        return (/(chrome|safari)/).exec(treesaver.capabilities.ua_)[0];
      }
      else {
        return 'webkit';
      }
    }
    else if (/opera/.test(treesaver.capabilities.ua_)) {
      return 'opera';
    }
    else if (/msie/.test(treesaver.capabilities.ua_)) {
      return 'msie';
    }
    else if (!/compatible/.test(treesaver.capabilities.ua_) &&
      /mozilla/.test(treesaver.capabilities.ua_)) {
        if (/trident/.test(treesaver.capabilities.ua_)) {
          return 'msie';
        }
        else {
          return 'mozilla';
        }
    }
    else {
      return 'unknown';
    }
  }());

  /**
   * Which OS is the browser running on, possible values:
   *   - win
   *   - mac
   *   - linux
   *   - iphone
   *   - ipad
   *   - ipod
   *   - android
   *   - unknown
   *
   * @const
   * @type {string}
   */
  treesaver.capabilities.BROWSER_OS =
    (/(android|ipad|iphone|ipod|win|mac|linux)/.
    exec(treesaver.capabilities.platform_) || ['unknown'])[0];

  /**
   * Browser engine prefix for non-standard CSS properties
   *
   * @const
   * @type {string}
   */
  treesaver.capabilities.cssPrefix = (function() {
    switch (treesaver.capabilities.BROWSER_NAME) {
    case 'chrome':
    case 'safari':
    case 'webkit':
      return '-webkit-';
    case 'mozilla':
      return '-moz-';
    case 'msie':
      return '-ms-';
    case 'opera':
      return '-o-';
    default:
      return '';
    }
  }());

  /**
   * Browser engine prefix for non-standard CSS properties
   *
   * @const
   * @type {string}
   */
  treesaver.capabilities.domCSSPrefix = (function() {
    switch (treesaver.capabilities.BROWSER_NAME) {
    case 'chrome':
    case 'safari':
    case 'webkit':
      return 'Webkit';
    case 'mozilla':
      return 'Moz';
    case 'msie':
      return 'ms';
    case 'opera':
      return 'O';
    default:
      return '';
    }
  }());

  /**
   * Helper function for testing CSS properties
   *
   * @private
   * @param {!string} propName
   * @param {boolean=} testPrefix
   * @param {boolean=} skipPrimary
   * @return {boolean}
   */
  treesaver.capabilities.cssPropertySupported_ = function(propName, testPrefix, skipPrimary) {
    var styleObj = document.documentElement.style,
        prefixed = testPrefix && treesaver.capabilities.domCSSPrefix ?
          (treesaver.capabilities.domCSSPrefix + propName[0].toUpperCase() + propName.substr(1)) :
          false;

    return (!skipPrimary && typeof styleObj[propName] !== 'undefined') ||
          (!!prefixed && typeof styleObj[prefixed] !== 'undefined');
  };

  /**
   * Helper function for testing support of a CSS @media query
   * Hat tip to Modernizr for this code
   *
   * @private
   * @param {!string} queryName
   * @param {boolean=} testPrefix
   * @return {boolean}
   */
  treesaver.capabilities.mediaQuerySupported_ = function(queryName, testPrefix) {
    var st = document.createElement('style'),
        div = document.createElement('div'),
        div_id = 'ts-test',
        mq = '@media (' + queryName + ')',
        result;

    if (testPrefix) {
      mq += ',(' + treesaver.capabilities.cssPrefix + queryName + ')';
    }

    st.textContent = mq + '{#' + div_id + ' {height:3px}}';
    div.setAttribute('id', div_id);
    document.documentElement.appendChild(st);
    document.documentElement.appendChild(div);

    // Confirm the style was applied
    result = div.offsetHeight === 3;

    document.documentElement.removeChild(st);
    document.documentElement.removeChild(div);

    return result;
  };

  /**
   * Whether the browser exposes orientation information
   *
   * @const
   * @type {boolean}
   */
  treesaver.capabilities.SUPPORTS_ORIENTATION = treesaver.capabilities.IS_NATIVE_APP ||
    'orientation' in window;

  /**
   * Whether the browser supports touch events
   *
   * @const
   * @type {boolean}
   */
  treesaver.capabilities.SUPPORTS_TOUCH = treesaver.capabilities.IS_NATIVE_APP ||
    'createTouch' in document ||
    // Android doesn't expose createTouch, use quick hack
    /android/.test(treesaver.capabilities.ua_);

  /**
   * Does the browser have flash support?
   *
   * @const
   * @type {boolean}
   */
  treesaver.capabilities.SUPPORTS_FLASH = !treesaver.capabilities.IS_NATIVE_APP && (function() {
    if (!!window.navigator.plugins && window.navigator.plugins.length) {
      // Non-IE browsers are pretty simple
      return !!window.navigator.plugins['Shockwave Flash'];
    }
    else if (SUPPORT_IE && 'ActiveXObject' in window) {
      try {
        // Throws exception if not in registry
        return !!(new window.ActiveXObject('ShockwaveFlash.ShockwaveFlash.7'));
      }
      catch (e) {
        // Instantiation failed
        return false;
      }
    }

    return false;
  }());

  /**
   * Does the browser support custom fonts via @font-face
   *
   * Note that this detection is fast, but imperfect. Gives a false positive
   * for a few fringe browsers.
   *
   * @const
   * @type {boolean}
   */
  treesaver.capabilities.SUPPORTS_FONTFACE = (function() {
    // Quick and easy test that works in FF2+, Safari, IE9+, and Opera
    // Note: This gives a false positive for older versions of Chrome,
    // (version 3 and earlier). Market share is too low to care
    return 'CSSFontFaceRule' in window;
  }());

  /**
   * Whether the browser supports <canvas>
   *
   * @const
   * @type {boolean}
   */
  treesaver.capabilities.SUPPORTS_CANVAS =
    'getContext' in document.createElement('canvas');

  /**
   * SVG detection based on Modernizr (http://www.modernizr.com)
   * Copyright (c) 2009-2011, Faruk Ates and Paul Irish
   * Dual-licensed under the BSD or MIT licenses.
   */
  if ('createElementNS' in document) {
    /**
     * Whether the browser supports SVG
     *
     * @const
     * @type {boolean}
     */
    treesaver.capabilities.SUPPORTS_SVG =
      // Don't bother with SVG in IE7/8
      'createElementNS' in document &&
      'createSVGRect' in document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    /**
     * Whether the browser supports SMIL
     *
     * @const
     * @type {boolean}
     */
    treesaver.capabilities.SUPPORTS_SMIL = treesaver.capabilities.SUPPORTS_SVG &&
      /SVG/.test(document.createElementNS('http://www.w3.org/2000/svg', 'animate').toString());

    /**
     * Whether the browser supports SVG clip paths
     *
     * @const
     * @type {boolean}
     */
    treesaver.capabilities.SUPPORTS_SVGCLIPPATHS = treesaver.capabilities.SUPPORTS_SVG &&
      /SVG/.test(document.createElementNS('http://www.w3.org/2000/svg', 'clipPath').toString());
  }

  treesaver.capabilities.SUPPORTS_INLINESVG = (function() {
    var div = document.createElement('div');
    div.innerHTML = '<svg/>';
    return (div.firstChild && div.firstChild.namespaceURI) == 'http://www.w3.org/2000/svg';
  }());

  /**
   * Whether the browser can play <video>
   *
   * @const
   * @type {boolean}
   */
  treesaver.capabilities.SUPPORTS_VIDEO =
    'canPlayType' in document.createElement('video');

  /**
   * Whether the browser supports localStorage
   *
   * @const
   * @type {boolean}
   */
  treesaver.capabilities.SUPPORTS_LOCALSTORAGE = 'localStorage' in window;

  /**
   * Whether the browser supports offline web applications
   *
   * @const
   * @type {boolean}
   */
  treesaver.capabilities.SUPPORTS_APPLICATIONCACHE =
    !treesaver.capabilities.IS_NATIVE_APP && 'applicationCache' in window;

  /**
   * Whether the page was loaded from the home screen
   *
   * @const
   * @type {boolean}
   */
  treesaver.capabilities.IS_FULLSCREEN = treesaver.capabilities.IS_NATIVE_APP ||
    window.navigator.standalone;

  /**
   * Whether the browser supports CSS transforms
   *
   * @const
   * @type {boolean}
   */
  treesaver.capabilities.SUPPORTS_CSSTRANSFORMS = treesaver.capabilities.IS_NATIVE_APP ||
    treesaver.capabilities.cssPropertySupported_('transformProperty') ||
    // Browsers used WebkitTransform instead of WebkitTransformProperty
    treesaver.capabilities.cssPropertySupported_('transform', true, true);

  /**
   * Whether the browser supports CSS 3d transforms
   *
   * @const
   * @type {boolean}
   */
  treesaver.capabilities.SUPPORTS_CSSTRANSFORMS3D = treesaver.capabilities.IS_NATIVE_APP ||
    (function() {
      var result = treesaver.capabilities.cssPropertySupported_('perspectiveProperty') ||
        treesaver.capabilities.cssPropertySupported_('perspective', true, true);

      // Chrome gives false positives for webkitPerspective
      // Hat tip to modernizr
      if (result && 'WebkitPerspective' in document.documentElement.style &&
        treesaver.capabilities.BROWSER_NAME !== 'safari') {
        // Confirm support via media query test
        result = treesaver.capabilities.mediaQuerySupported_('perspective', true);
      }

      return result;
    }());

  /**
   * Whether the browser supports CSS transitions
   *
   * @const
   * @type {boolean}
   */
  treesaver.capabilities.SUPPORTS_CSSTRANSITIONS = treesaver.capabilities.IS_NATIVE_APP ||
    treesaver.capabilities.cssPropertySupported_('transitionProperty', true);

  /**
   * Whether the browser supports sub-pixel rendering
   *
   * @const
   * @type {boolean}
   */
  treesaver.capabilities.SUPPORTS_SUBPIXELS = (function() {
    var d = document.createElement('div'),
        result;

    d.style['visibility'] = 'hidden';
    d.style['fontSize'] = '13px';
    d.style['height'] = '1.5em';

    document.documentElement.appendChild(d);
    result = (d.getBoundingClientRect().height % 1);
    document.documentElement.removeChild(d);

    return result;
  }());

  /**
   * Current browser capabilities
   *
   * @private
   * @type {Array.<string>}
   */
  treesaver.capabilities.caps_;

  /**
   * Mutable browser capabilities, such as online/offline, that may change
   * after a page is loaded
   *
   * @private
   * @type {Array.<string>}
   */
  treesaver.capabilities.mutableCaps_;

  /**
   * Return 'no-' if false
   *
   * @private
   * @param {!boolean} val
   * @return {!string} 'no-' if val is false, '' otherwise.
   */
  treesaver.capabilities.doPrefix_ = function(val) {
    return val ? '' : 'no-';
  };

  /**
   * Test the browser's capabilities and populate the cached caps_ array
   *
   * @private
   */
  treesaver.capabilities.update_ = function() {
    // Ugh, closure style makes this really gross, store function
    // for some reprieve
    var p = treesaver.capabilities.doPrefix_;

    if (!treesaver.capabilities.caps_) {
      // First run through, populate the static capabilities that never change
      treesaver.capabilities.caps_ = [];
      treesaver.capabilities.caps_.push(
        // Use the same class names as modernizr when applicable
        'js',
        p(treesaver.capabilities.SUPPORTS_CANVAS) + 'canvas',
        p(treesaver.capabilities.SUPPORTS_LOCALSTORAGE) + 'localstorage',
        p(treesaver.capabilities.SUPPORTS_VIDEO) + 'video',
        p(treesaver.capabilities.SUPPORTS_APPLICATIONCACHE) + 'applicationcache',
        p(treesaver.capabilities.SUPPORTS_FONTFACE) + 'fontface',
        p(treesaver.capabilities.SUPPORTS_TOUCH) + 'touch',
        p(treesaver.capabilities.SUPPORTS_CSSTRANSFORMS) + 'csstransforms',
        p(treesaver.capabilities.SUPPORTS_CSSTRANSFORMS3D) + 'csstransforms3d',
        p(treesaver.capabilities.SUPPORTS_CSSTRANSITIONS) + 'csstransitions',
        p(treesaver.capabilities.SUPPORTS_SVG) + 'svg',
        p(treesaver.capabilities.SUPPORTS_INLINESVG) + 'inlinesvg',
        p(treesaver.capabilities.SUPPORTS_SMIL) + 'smil',
        p(treesaver.capabilities.SUPPORTS_SVGCLIPPATHS) + 'svgclippaths',
        // Not in modernizr
        p(treesaver.capabilities.SUPPORTS_TREESAVER) + 'treesaver',
        p(treesaver.capabilities.SUPPORTS_FLASH) + 'flash',
        p(treesaver.capabilities.SUPPORTS_ORIENTATION) + 'orientation',
        p(treesaver.capabilities.IS_FULLSCREEN) + 'fullscreen',
        p(treesaver.capabilities.IS_MOBILE) + 'mobile',
        p(treesaver.capabilities.IS_SMALL_SCREEN) + 'smallscreen',
        p(treesaver.network.loadedFromCache()) + 'cached',
        p(treesaver.capabilities.IS_NATIVE_APP) + 'nativeapp',
        p(treesaver.capabilities.SUPPORTS_SUBPIXELS) + 'subpixels',
        // Browser/platform info
        'browser-' + treesaver.capabilities.BROWSER_NAME,
        'os-' + treesaver.capabilities.BROWSER_OS
      );
    }

    // Always update mutable info
    treesaver.capabilities.mutableCaps_ = [
      // Online/offline
      p(!treesaver.network.isOnline()) + 'offline'
    ];

    if (treesaver.capabilities.SUPPORTS_ORIENTATION) {
      // Orientation
      treesaver.capabilities.mutableCaps_.push(
        'orientation-' + (window['orientation'] ? 'horizontal' : 'vertical')
      );
    }
  };

  /**
   * Have the stable capability flags been added to the <html> element?
   *
   * @private
   * @type {boolean}
   */
  treesaver.capabilities.capsFlagged_ = false;

  /**
   * Update the classes on the <html> element based on current capabilities
   */
  treesaver.capabilities.updateClasses = function() {
    // Refresh stored capabilities
    treesaver.capabilities.update_();

    var className = document.documentElement.className;

    if (!treesaver.capabilities.capsFlagged_) {
      treesaver.capabilities.capsFlagged_ = true;

      if (className) {
        // First time through, remove no-js and no-treesaver flags, if present
        className = className.replace(/no-js|no-treesaver/g, '');
      }
      else {
        // Class was blank, give an initial value
        className = '';
      }

      // Add the non-mutable capabilities on the body
      className += ' ' + treesaver.capabilities.caps_.join(' ');
    }

    // Now, remove values of mutable capabilities
    // TODO: As we get more of these, need a simpler way to filter out the old values
    // Make sure to reset the lastIndex for non-sticky search
    treesaver.capabilities.mutableCapabilityRegex_.lastIndex = 0;
    className = className.replace(treesaver.capabilities.mutableCapabilityRegex_, '');

    className += ' ' + treesaver.capabilities.mutableCaps_.join(' ');

    // Now set the classes (and normalize whitespace)
    document.documentElement.className = className.split(/\s+/).join(' ');
  };

  /**
   * Reset the classes on the documentElement to a non-treesaver
   */
  treesaver.capabilities.resetClasses = function() {
    document.documentElement.className = 'js no-treesaver';
  };

  /**
   * Array with all the mutable capability names
   *
   * @private
   * @type {!Array.<string>}
   */
  treesaver.capabilities.mutableCapabilityList_ = [
    'offline',
    'orientation-vertical',
    'orientation-horizontal'
  ];

  /**
   * Regex for removing mutable capabilities from a string
   *
   * @private
   * @type {!RegExp}
   */
  treesaver.capabilities.mutableCapabilityRegex_ = (function() {
    var terms = treesaver.capabilities.mutableCapabilityList_.map(function(term) {
      return '((no-)?' + term + ')';
    });

    return new RegExp(terms.join('|'), 'g');
  }());

  /**
   * Check if a set of requirements are met by the current browser state
   *
   * @param {!Array.<string>} required Required capabilities.
   * @param {boolean=} useMutable Whether mutable capabilities should be
   *                                checked as well.
   * @return {boolean} True if requirements are met.
   */
  treesaver.capabilities.check = function checkCapabilities(required, useMutable) {
    if (!required.length) {
      return true;
    }

    // Requirements are in the form of 'flash', 'offline', or 'no-orientation'
    return required.every(function(req) {
      var isNegation = req.substr(0, 3) === 'no-',
          rootReq = isNegation ? req.substr(3) : req,
          allCaps = treesaver.capabilities.caps_.concat(
            useMutable ? treesaver.capabilities.mutableCaps_ : []
          );

      if (isNegation) {
        // If it's negation, make sure the capability isn't in the capability list
        return allCaps.indexOf(rootReq) === -1;
      }
      else {
        if (allCaps.indexOf(rootReq) !== -1) {
          // Have the capability, all good
          return true;
        }

        // Requirement may be a mutable property, need to check
        if (!useMutable &&
            treesaver.capabilities.mutableCapabilityList_.indexOf(rootReq) !== -1) {
            // Requirement isn't met, but is mutable, let it pass for now
            return true;
        }

        return false;
      }
    });
  };

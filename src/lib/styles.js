/**
 * @fileoverview Create a stylesheet with the built-in styles required by Treesaver.
 */


  var styles = {},
      debug = require('./debug'),
      dom = require('./dom');

  /**
   * @param {!string} selector
   * @param {!string} text
   */
  styles.insertRule = function(selector, text) {
    styles.stylesheet_.insertRule(selector + '{' + text + '}', 0);
  }

  styles.stylesheet_ = document.createElement('style');
  styles.stylesheet_.setAttribute('type', 'text/css');

  if (dom.querySelectorAll('head').length) {
    dom.querySelectorAll('head')[0].appendChild(treesaver.styles.stylesheet_);
    styles.stylesheet_ = document.styleSheets[document.styleSheets.length - 1];

    // Offscreen
    styles.insertRule('.offscreen',
      'position:absolute;top:-200%;right:-200%;visibility:hidden;');
    // Grids are centered in the viewer
    styles.insertRule('.viewer .grid', 'top:50%;left:50%;margin:0');
  }
  else {
    debug.error('No head to put default stylesheet into');
  }
module.exports = styles;

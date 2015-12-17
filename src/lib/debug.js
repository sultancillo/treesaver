/**
 * @fileoverview Logging functions for use while debugging.
 */
treesaver = treesaver || {};
treesaver.debug = treesaver.debug || {};


require('./capabilities');




  /**
   * Original load time of debug code
   *
   * @const
   * @type {number}
   */
  treesaver.debug.startupTime_ = goog.now();

  /**
   * Creates a timestamp for a log entry
   *
   * @return {!string}
   */
  treesaver.debug.timestamp_ = function() {
    return '[' + (goog.now() - treesaver.debug.startupTime_).toFixed(3) / 1000 + 's] ';
  };

  /**
   * Log a message
   * @param {!string} msg
   */
  treesaver.debug.info = function(msg) {
    if (goog.DEBUG && window.console) {
      msg = treesaver.debug.timestamp_() + msg;

      if ('info' in window.console) {
        window.console['info'](msg);
      }
      else {
        window.console.log(msg);
      }
    }
  };

  /**
   * Log a message
   * @param {!string} msg
   */
  treesaver.debug.log = function(msg) {
    if (goog.DEBUG && window.console) {
      msg = treesaver.debug.timestamp_() + msg;

      if ('debug' in window.console) {
        window.console['debug'](msg);
      }
      else {
        window.console.log(msg);
      }
    }
  };

  /**
   * Log a message
   * @param {!string} msg
   */
  treesaver.debug.warn = function(msg) {
    if (goog.DEBUG && window.console) {
      msg = treesaver.debug.timestamp_() + msg;

      if ('warn' in window.console) {
        window.console['warn'](msg);
      }
      else {
        window.console.log(msg);
      }
    }
  };

  /**
   * Log a message
   * @param {!string} msg
   */
  treesaver.debug.error = function(msg) {
    if (goog.DEBUG && window.console) {
      msg = treesaver.debug.timestamp_() + msg;

      if ('error' in window.console) {
        window.console['error'](msg);
      }
      else {
        window.console.log(msg);
      }
    }
  };

  /**
   * Assert helper
   * @param {boolean} assertion
   * @param {?string} msg
   */
  treesaver.debug.assert = function(assertion, msg) {
    if (goog.DEBUG && window.console) {
      if ('assert' in window.console) {
        window.console['assert'](assertion, msg);
      }
      else if (!assertion) {
        treesaver.debug.error('Assertion failed: ' + msg);
      }
    }
  };

  treesaver.debug.info('Running in DEBUG mode');


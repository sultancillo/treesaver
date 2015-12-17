/**
 * @fileoverview Event helper functions.
 */

treesaver = treesaver || {};
treesaver.events = treesaver.events || {};


goog('./debug');


  var events = treesaver.events,
      debug = treesaver.debug;

  /**
   * Create an event and fire it
   *
   * @param {!*} obj
   * @param {!string} type
   * @param {Object=} data
   */
  treesaver.events.fireEvent = function(obj, type, data) {
    var e = document.createEvent('UIEvents'),
        cur,
        val;

    // TODO: Test cancelling
    e.initEvent(type, false, true);
    // Copy provided data into event object
    if (data) {
      for (cur in data) {
        e[cur] = data[cur];
      }
    }

    return obj.dispatchEvent(e);
  };

  /**
   * Add an event listener to an element
   *
   * @param {!*} obj
   * @param {!string} type
   * @param {!function()|!Object} fn
   */
  treesaver.events.addListener = function(obj, type, fn) {
    // Help out while debugging, but don't pay the performance hit
    // for a try/catch in production
    if (goog.DEBUG) {
      try {
        obj.addEventListener(type, fn, false);
      }
      catch (ex) {
        treesaver.debug.error('Could not add ' + type + ' listener to: ' + obj);
        treesaver.debug.error('Exception ' + ex);
      }
    }
    else {
      obj.addEventListener(type, fn, false);
    }
  };

  /**
   * Remove an event listener from an element
   *
   * @param {!*} obj
   * @param {!string} type
   * @param {!function()|!Object} fn
   */
  treesaver.events.removeListener = function(obj, type, fn) {
    // Help out with debugging, but only in debug
    if (goog.DEBUG) {
      try {
        obj.removeEventListener(type, fn, false);
      }
      catch (ex) {
        treesaver.debug.error('Could not remove ' + type + ' listener from: ' + obj);
        treesaver.debug.error('Exception ' + ex);
      }
    }
    else {
      obj.removeEventListener(type, fn, false);
    }
  };


// Expose event helper functions via externs
goog.exportSymbol('treesaver.addListener', treesaver.events.addListener);
goog.exportSymbol('treesaver.removeListener', treesaver.events.removeListener);

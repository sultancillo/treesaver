/**
 * @fileoverview Extract fonts defined in an external HTML file.
 */
treesaver = treesaver || {};
treesaver.fonts = treesaver.fonts || {};


require('./fonts/googleadapter');
require('./debug');
require('./dom');
require('./events');



  /**
   * Loads custom fonts for the current document
   *
   * @param {!function()} callback
   */
   treesaver.fonts.load = function(callback) {
    if (!window['treesaverFonts']) {
      treesaver.debug.info("No treesaverFonts specified; nothing to do here.");
      callback();
      return;
    }

    if (treesaver.fonts.loadStatus_) {
      if (treesaver.fonts.loadStatus_ ===
          treesaver.fonts.LoadStatus.LOADED) {
        // Already loaded, callback immediately
        callback();
      }
      else {
        // Not loaded yet, add callback to list
        treesaver.fonts.callbacks_.push(callback);
      }

      return;
    }

    treesaver.fonts.loadStatus_ = treesaver.fonts.LoadStatus.LOADING;
    // Not loaded yet, add callback to list
    treesaver.fonts.callbacks_ = [callback];
    // do the stuff
    treesaver.events.addListener(document, treesaver.customevents.LOADERSHOWN, treesaver.fonts.load_);
  };

  treesaver.fonts.load_ = function() {
    treesaver.fonts.googleadapter.load(window['treesaverFonts'], function(result) {
      var classes = [], className, family;
      for (family in result) {
        if (result.hasOwnProperty(family)) {
          className = 'ts-' + treesaver.fonts.slugify(family) + (result[family] == 'active' ? '-active' : '-inactive');
          classes.push(className);
        }
      }
      treesaver.dom.addClass(document.documentElement, classes.join(' '));
      treesaver.fonts.loadComplete_();
    });
  };

  treesaver.fonts.slugify = function(name) {
    return name.toLowerCase().replace(/[^a-z]+/g, '-');
  };

  /**
   * Called when custom fonts loading is finished
   */
  treesaver.fonts.loadComplete_ = function() {
    treesaver.fonts.loadStatus_ = treesaver.fonts.LoadStatus.LOADED;

    // Clone callback array
    var callbacks = treesaver.fonts.callbacks_.slice(0);

    // Clear out old callbacks
    treesaver.fonts.callbacks_ = [];

    // Do callbacks
    callbacks.forEach(function(callback) {
      callback();
    });
  };

  treesaver.fonts.unload = function() {
    treesaver.debug.info('treesaver.fonts.unload');
    treesaver.fonts.loadStatus_ = treesaver.fonts.LoadStatus.NOT_LOADED;
    treesaver.fonts.callbacks_ = [];
  };

  /**
   * Load status enum
   * @enum {number}
   */
  treesaver.fonts.LoadStatus = {
    LOADED: 2,
    LOADING: 1,
    NOT_LOADED: 0
  };

  /**
   * Load status of fonts
   *
   * @private
   * @type {treesaver.fonts.LoadStatus}
   */
  treesaver.fonts.loadStatus_;

  /**
   * Callbacks
   *
   * @private
   * @type {Array.<function()>}
   */
  treesaver.fonts.callbacks_;


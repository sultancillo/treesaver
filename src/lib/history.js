/**
 * @fileoverview Proxy for HTML5 window history functions for browsers that
 * do not support it.
 */

  var history = {},
      debug = require('./debug'),
      events = require('./events'),
      scheduler = require('./scheduler'),
      storage = require('./storage');

  /**
   * @type {Object.<string, string>}
   */
  history.events = {
    POPSTATE: 'popstate'
  };

  // Don't do anything when in an app wrapper
  if (WITHIN_IOS_WRAPPER) {
    /**
     * Dummy function
     *
     * @param {!Object} data
     * @param {!string} title
     * @param {!string} url
     */
    history.pushState = function(data, title, url) {
    };

    /**
     * Dummy function
     *
     * @param {!Object} data
     * @param {!string} title
     * @param {!string} url
     */
    history.replaceState = function(data, title, url) {
    };
  }
  else {
    /**
     * Hash prefix used to mark a hash generated by this library
     *
     * @const
     * @type {string}
     */
    history.DELIMITER = '-';

    /**
     * Does the browser have a native implementation of the history functions
     * @const
     * @private
     * @type {boolean}
     */
    history.NATIVE_SUPPORT = 'pushState' in window.history;

    /**
     * Return the value of the current document hash, minus any leading '#'
     * @private
     * @return {string} The normalized hash value.
     */
    history.getNormalizedHash_ = function() {
      // IE7 does funky things with the location.hash property when the URL contains a
      // query string. Firefox 3.5 has quirks around escaping hash values ( hat tip: blixt
      // https://github.com/blixt/js-hash/ )
      //
      // Therefore, use location.href instead of location.hash, as blixt did (MIT license)
      var index = document.location.href.indexOf('#');
      return index === -1 ? '' : document.location.href.substr(index + 1);
    };

    // Even if the client has a native implementation of the API, we have to check
    // the hash on load just in case the visitor followed a link generated by a
    // browser that does not have native support
    if (document.location.hash) {
      history.current_hash = history.getNormalizedHash_();

      // Our hashes always start with the delimiter and have at least another
      // character there
      if (history.current_hash[0] === history.DELIMITER &&
          history.current_hash.length >= 2) {
        // Redirect, stripping the intial delimiter
        // Use location.replace instead of setting document.location to avoid
        // breaking the back button
        document.location.replace(history.current_hash.substr(1));
      }
    }

    // Forward to native
    history.pushState = function(data, title, url) {
      window.history['pushState'](data, title, url);
    };

    // Forward to native
    history.replaceState = function(data, title, url) {
      window.history['replaceState'](data, title, url);
    };

    // History helper functions only needed for browsers that don't
    // have native support
    if (!history.NATIVE_SUPPORT) {
      debug.info('Using non-native history implementation');

      // Override functions for browsers with non-native support
      history.pushState = function(data, title, url) {
        history._changeState(data, title, url, false);
      };
      history.replaceState = function(data, title, url) {
        history._changeState(data, title, url, true);
      };

      /**
       * Create a hash for a given URL
       *
       * @private
       * @param {!string} url
       * @return {string} String that can be safely used as hash.
       */
      history.createHash_ = function(url) {
        // Always add delimiter and escape the URL
        return history.DELIMITER + window.escape(url);
      };

      /**
       * Set the browser hash. Necessary in order to override behavior when
       * using IFrame for IE7
       *
       * @private
       * @param {!string} hash
       */
      history.setLocationHash_ = function(hash) {
        document.location.hash = '#' + hash;
      };

      /**
       * Set the browser hash without adding a history entry
       *
       * @private
       * @param {!string} hash
       */
      history.replaceLocationHash_ = function(hash) {
        document.location.replace('#' + hash);
      };

      /**
       * Storage prefix for history items
       *
       * @const
       * @private
       * @type {string}
       */
      history.STORAGE_PREFIX = 'history:';

      /**
       * Create key name for storing history data
       *
       * @private
       * @param {!string} key
       * @return {string} String that can be safely used as storage key.
       */
      history.createStorageKey_ = function(key) {
        return history.STORAGE_PREFIX + key;
      };

      /**
       * @private
       * @param {?Object} data
       * @param {?string} title
       * @param {!string} url
       * @param {boolean} replace
       */
      history._changeState = function _changeState(data, title, url, replace) {
        var hash_url = history.createHash_(url);

        // Store data using url
        storage.set(
          history.createStorageKey_(hash_url),
          { state: data, title: title }
        );

        // If we're using the same URL as the current page, don't double up
        if (url === document.location.pathname) {
          hash_url = '';
        }

        // HTML5 implementation only calls popstate as a result of a user action,
        // store the hash so we don't trigger a false event
        history.hash_ = hash_url;

        // Use the URL as a hash
        if (replace) {
          history.replaceLocationHash_(hash_url);
        }
        else {
          history.setLocationHash_(hash_url);
        }
      };

      /**
       * Receive the hashChanged event (native or manual) and fire the onpopstate
       * event
       * @private
       */
      history.hashChange_ = function hashChange_() {
        var new_hash = history.getNormalizedHash_(),
            data;

        // False alarm, ignore
        if (new_hash === history.hash_) {
          return;
        }

        history.hash_ = new_hash;
        data = history.hash_ ?
          storage.get(history.createStorageKey_(new_hash)) :
          {};

        debug.info('New hash: ' + history.hash_);

        // Now, fire onpopstate with the state object
        // NOTE: popstate fires on window, not document
        events.fireEvent(window, history.events.POPSTATE,
          { 'state': data ? data.state : null });
      };

      // Setup handler to receive events
      window['onhashchange'] = history.hashChange_;
    }
  }

module.exports = history;

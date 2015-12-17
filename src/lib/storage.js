/**
 * @fileoverview Simple wrapper for localStorage.
 */
treesaver = treesaver || {};
treesaver.storage = treesaver.storage || {};


require('./debug');




          localStore = window.localStorage,
          sessionStore = window.sessionStorage;

  /**
   * @param {!string} key
   * @param {!*} value
   * @param {boolean=} persist
   */
  treesaver.treesaver.storage.set = function set(key, value, persist) {
    var store = persist ? localStore : sessionStore;

    // iPad throws QUOTA_EXCEEDED_ERR frequently here, even though we're not
    // using that much storage
    // Clear the storage first in order to avoid this error
    store.removeItem(key);

    try {
      store.setItem(key, treesaver.json.stringify(value));
    }
    catch (ex) {
      // Still happened, not much we can do about it
      // TODO: Do something about it? :)
    }
  };

  /**
   * @param {!string} key
   * @return {*} Previously stored value, if any.
   */
  treesaver.storage.get = function(key) {
    // Session take precedence over local
    var val = sessionStore.getItem(key) || localStore.getItem(key);

    if (val) {
      return treesaver.json.parse( /** @type {string} */ (val));
    }
    else {
      return null;
    }
  };

  /**
   * @param {!string} key
   */
  treesaver.storage.clear = function(key) {
    sessionStore.removeItem(key);
    localStore.removeItem(key);
  };

  /**
   * Returns a list of keys currently used in storage
   *
   * @param {string=} prefix
   * @return {!Array.<string>}
   */
  treesaver.storage.getKeys_ = function(prefix) {
    var all_keys = [],
        i, len, key,
        prefix_len;

    prefix = prefix || '';
    prefix_len = prefix.length;

    for (i = 0, len = localStore.length; i < len; i += 1) {
      key = localStore.key(i);
      if (key && (!prefix || prefix === key.substr(0, prefix_len))) {
        all_keys.push(localStore.key(i));
      }
    }

    for (i = 0, len = sessionStore.length; i < len; i += 1) {
      key = sessionStore.key(i);
      if (all_keys.indexOf(key) === -1 &&
          (!prefix || prefix === key.substr(0, prefix_len))) {
        all_keys.push(key);
      }
    }

    return all_keys;
  };

  /**
   * Cleans up space in storage
   * @param {string=} prefix
   * @param {!Array.<string>=} whitelist
   */
  treesaver.storage.clean = function(prefix, whitelist) {
    if (!whitelist) {
      localStore.clear();
      sessionStore.clear();
    }
    else {
      treesaver.storage.getKeys_(prefix).forEach(function(key) {
        if (!whitelist || whitelist.indexOf(key) === -1) {
          treesaver.storage.clear(key);
        }
      });
    }
  };


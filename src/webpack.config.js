var webpack = require('webpack');
var definePlugin = new webpack.DefinePlugin({
/**
 * Is the application being hosted within the iOS wrapper?
 *
 * @define {boolean}
 */
	WITHIN_IOS_WRAPPER: false,
	UI_IDLE_INTERVAL: 5000, // 5 seconds
	/**
 * Whether Internet Explorer should be supported
 *
 * @define {boolean}
 */
 SUPPORT_IE: true,

/**
 * How long until the UI is deemed idle
 *
 * @define {number}
 */


/**
 * How long to wait before kicking off repagination when resizing
 *
 * @define {number}
 */
 PAGINATE_DEBOUNCE_TIME: 200, // .2 seconds

/**
 * How many pixels of movement before it's considered a swipe
 *
 * @define {number}
 */
 SWIPE_THRESHOLD: 30,

/**
 * How much time can elapse before the swipe is ignored
 *
 * @define {number}
 */
 SWIPE_TIME_LIMIT: 2000, // 2 seconds

/**
 * Length of page animations
 *
 * @define {number}
 */
 MAX_ANIMATION_DURATION: 200, // .2 seconds

/**
 * How often to check for resizes and orientations
 *
 * @define {number}
 */
 CHECK_STATE_INTERVAL: 100, // .1 seconds

/**
 * How long to wait between mouse wheel events
 * Magic mouse can generate a ridiculous number of events
 *
 * @define {number}
 */
 MOUSE_WHEEL_INTERVAL: 400, // .4 seconds

});

module.exports = {
  entry: './treesaver.js',
  output: {
    filename: '../build/treesaver.js'       
  },
  plugins: [definePlugin]
};
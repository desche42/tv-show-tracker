/**
 * Proxy for the colorized output
 */
const DEBUG_NAMESPACE = 'tv-show-tracker';
const debug = require('debug');

debug.enable(`*${DEBUG_NAMESPACE}:*`);

/**
 * Easy output aproach function
 * @toDo use chalk to output, debug for debug, duh
 * @param {String} subSpace for debugging
 * @returns {Function} that accepts a message<String> to debug
 * @example fn('download')('modern family') debugs
 * ['
 */
module.exports = subSpace => message => {
	debug(`[${DEBUG_NAMESPACE}:${subSpace}] ${message}`);
}

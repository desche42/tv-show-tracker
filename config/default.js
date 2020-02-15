/**
 * Default configuration
 */
module.exports = {
  // searches for new torrents in chunks, newer are prioritized
  simultaneousSearchLimit: 3,
  // restarts life cycle (keeps relaunching until all torrents have been downloaded)
  restart: false
}

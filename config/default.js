/**
 * Default configuration
 */
module.exports = {
  /**
   * Download all episodes of current season for each selected show
   */
  completeLatestSeason: false,
  /**
   * Torrent download path
   */
  downloadPath:  './database/downloads',
  /**
   * Restarts life cycle (keeps relaunching until all torrents have been downloaded)
   */
  restart: false,
  /**
   * searches for new torrents in chunks, newer are prioritized
   */
	simultaneousSearchLimit: 6,
	/**
	 * Torrent search configuration
	 */
	torrentSearchEnablePublicProviders: true,
	// only if public providers not enabled
	torrentSearchEnableProviders: [
		'ExtraTorrent',
		'Torrent9'
	],
	// always disable
	torrentSearchDisableProviders: ['torrentz2'],
  /**
   * Updates TV Schedule Calendar
   */
  updateCalendar: true
}

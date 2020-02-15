/**
 * Default configuration
 */
module.exports = {
	/**
	 * File extensions to download
	 */
	allowedVideoExtensions: ['mkv', 'avi', 'mp4'],
  /**
   * Download all episodes of current season for each selected show
	 * @todo not implemented
   */
  completeLatestSeason: false,
  /**
   * Torrent dir download path.
   */
	downloadPath:  './database/downloads',
	/**
	 * If false, all episodes in db of selected shows will be downloaded
	 */
	downloadLastSeasonOnly: true,
  /**
   * Restarts life cycle (keeps relaunching until all torrents have been downloaded)
   */
	restart: false,
  /**
   * searches for new episode torrents in chunks, newer are prioritized
   */
	simultaneousSearchLimit: 6,
	/**
	 *
	 */
	simultaneousDownloadLimit: 3,
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
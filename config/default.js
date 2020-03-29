/**
 * Default configuration
 */
module.exports = {
	/**
	 * File extensions to download
	 */
	allowedVideoExtensions: ['mkv', 'avi', 'mp4'],
	/**
	 * Path for backup database and downloads
	 */
	backupPath: '',
  /**
   * Download all episodes of current season for each selected show
	 * @todo not implemented
   */
	completeLatestSeason: false,
	/**
	 * Relative path for the database
	 */
	databasePath: 'data/db.json',
  /**
   * Torrent dir download relative path.
   */
	downloadPath:  'data/downloads',
	/**
	 * If false, all episodes in db of selected shows will be downloaded
	 */
	downloadLastSeasonOnly: true,
	/**
	 * Local configuration path
	 */
	localConfigPath: 'config/local.json',
	/**
	 * Attempts to search for a torrent. Careful if restart option is activated,
	 * search limit will be reached, maybe blocking new episodes for being downloaded.
	 * Set to 0 to infinite attempts
	 */
	maxSearchAttempts: 0,
  /**
   * Restarts life cycle (keeps relaunching until all torrents have been downloaded)
   */
	restart: false,
	/**
	 * Starts searching for a torrent N hours after air date
	 * Usually air date is only the day, if show is aired at night,
	 * N should be at least 24
	 */
	searchAfterNHours: 24,
	selectedShows: [],
  /**
   * searches for new episode torrents in chunks, newer are prioritized
   */
	simultaneousSearchLimit: 6,
	/**
	 * Simultaneous torrent downloads each cycle
	 */
	simultaneousDownloadLimit: 3,
	/**
	 * Torrent search configuration
	 */
	torrentSearchEnablePublicProviders: true,
	// only if public providers not enabled
	torrentSearchEnableProviders: [],
	// always disable
	torrentSearchDisableProviders: ['torrentz2'],
  /**
   * Updates TV Schedule Calendar
   */
	updateCalendar: true,
	/**
	 * vlc command
	 * for macOs: '/Applications/VLC.app/Contents/MacOS/VLC'
	 */
	vlcCommand: 'vlc'
}

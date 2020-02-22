# TV SHOW TRACKER

Stop searching for torrents, simply select which shows you want to track and new episodes will be automatically dowloaded as soon
as they're available!


- [TV SHOW TRACKER](#tv-show-tracker)
- [Installation](#installation)
- [Usage](#usage)
	- [Adding shows to track](#adding-shows-to-track)
	- [Track shows](#track-shows)
	- [Watch downloaded shows](#watch-downloaded-shows)
	- [Further configuration](#further-configuration)
- [Lifecycle](#lifecycle)
- [Limitations](#limitations)
- [TO DO's](#to-dos)
	- [v2](#v2)
	- [v2.1](#v21)
- [Change log](#change-log)
	- [v1](#v1)

# Installation

>
>*Commands may change depending on your OS.*


Globally install the package:

```bash
npm i -g tv-show-tracker
```

Program will be installed in your `node/bin` folder. Node folder can be found executing in a terminal:

```
which node
```

In this folder **database**, **downloads** and **config** files are stored.

Run the program:

```
tv-show-tracker
```

# Usage

## Adding shows to track

To add a show to track execute in a terminal:

```
tv-show-tracker add
```

and you will be prompted for the show name.

> Note that show name has to be the same as stored in database file.

Selected shos are stored the file `config/local.js`:

```javascript
{
	...
	selectedShows: [
		'doctor who',
		'the magicians',
		'brooklyn nine-nine',
		...
	]
	...
}
```

## Track shows

To track shows (search for and download new episodes), execute in a terminal:

```
tv-show-tracker track

// or simply

tv-show-tracker
```

The first time the program is run, TV Show schedule is crawled from an online web and available tv shows are populated in the database: `database/db.json`. 


And that's it!

## Watch downloaded shows

Shows are downloaded in `data/downloads/` folder inside app folder.
To watch completely downloaded episodes execute:

```
tv-show-tracker watch
```

And you will be prompted to select a show and an episode.


## Further configuration

File `config/default.js` has the default config and config keys descriptions.

You can create a local config file doing (in app installation folder):

```
echo '{}' > config/local.json
```

> Note that if you've added a show with 'tv-show-tracker add', the file will be automatically created.

Although config options are described in `config/default.js`, there is more information in:

- [Search](src/search/README.md)
- [Schedule](src/schedule/README.md)
- [Download](src/download/README.md)

and below.


# Lifecycle

1. **Update calendar**

	Calendar is updated if *config key* `updateCalendar` is set to true and current month is not found in the database.

2. **Start cycle**
	
	In each cylce two things are done simultaneously:

   1. **Search for new torrents**
   	
		 Aired episodes without a torrent are searched. Results are stored
		 into the DB to be downloaded next cycle.
		 Config key `maxSearchAttempts` sets the number of times an episode will be searched for a torrent before considering its dead. Set to 0 to infinite attempts.

   2. **Download available magnets**
   
	 	Episodes marked as not downloaded and have a torrent magnet start downloading (throttled with `simultaneousDownloadLimit` config key).

3. **Start new cycle** 
   
	 If *config key* `reset` is set to true, and there are new episodes to
	 search, new cycle is started.
	 --> if not torrents are found, it will keep searching **forever** (or until `maxSearchAttempts` are reached for all torrents)


# Limitations

This project is ment to automatically download latest episodes of tv shows, so them are expected to be alive (lots of peers). Downloading past episodes is slower
and may cause the app to hang, since it waits for the torrents to download before starting new downloads (see lifecycle).

# TO DO's

- [ ] Tests

## v2
- [x] Globally available / CLI 
  - [x] Change file path reading using path library
  - [x] Add show **add command**
  - [x] Set track shows as default action if no command is given **track command**
  - [x] Launch vlc for selected episode - **watch command**
    - [x] Filter episodes that are marked as downloaded
  - [x] Set config key maxSearchAttempts to 0 to infinite search attempts
  - [x] Move cli files to bin folder
- [ ] Documentation

## v2.1

- CLI
  - [ ] Add / remove seasons
  - [ ] Add magnet
- [ ] Change output / debug
  - [x] Add output module, uses debug package behind the scenes
  - [ ] Migrate module?
- [ ] Option of downloading complete seasons
  - [ ] Show info search --> episode details
- [ ] Create separate DDBB for shows info (committed), and episodes
  - [ ] Move all db transactions to a module with exposed methods, v3?
    - [ ] Mark episode as watched
      - [x] detect vlc video finished
      - [x] differenciate beetween video finished and user closing vlc
      - [ ] inquire and set to db
      - [ ] clean code
    - [ ] remove shows / mark as disabled

# Change log

## v1

- [x] Basic downloaded episode logger `npm run checkDownloaded`
- [x] Calendar force update after X days --> when month is not in db
- [x] Select shows more easily
- [x] Storage system
  - [x] Parse file names
    - [x] change showtitle property of episodes to parse name with external module
    - [x] shows stored as lowercase
- [x] Config file
  - [x] Search limit
  - [x] Restart lifecycle
- [x] Figure out which torrent search provider is giving timeout and disable it to speed up process
- [x] Restart lifecycle to keep searching for torrents while dowloading
- [x] Documentation

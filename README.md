# TV SHOW TRACKER

Stop searching for torrents, simply select which shows you want to track and new episodes will be automatically dowloaded as soon
as they're available!


- [TV SHOW TRACKER](#tv-show-tracker)
- [Installation](#installation)
	- [Configuration](#configuration)
- [Lifecycle](#lifecycle)
- [Limitations](#limitations)
- [TO DO's](#to-dos)
	- [v1.1](#v11)
	- [v2](#v2)
- [Change log](#change-log)
	- [v1](#v1)

# Installation

>
>*Commands may change depending on your OS.*
>
Clone the repo and install node dependencies:

```bash
git clone https://github.com/desche42/tv-show-tracker.git
cd tv-show-tracker
npm i
```

Change into directory and start!

```bash
# starts with lots of console info
npm run debug

# starts with redable console info
npm start
```

TV Show schedule is crawled from an online web and available tv shows are populated in the database: `database/db.json`. 

Edit the file `config/local.js` to **select the shows want to track**:

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

And that's it!

> **TIP**
> 
> If your terminal allows you to create aliases for commands (like zsh), adding: 
> 
> ```bash
> alias checkTvShows="cd ~/path/to/tv-show-tracker/; npm start;"
> ```
> 
> to your `.zshrc` file (or similar) will allow you to run the app opening a terminal and doing: > `checkTvShows`.

## Configuration

Copy `config/default.js` to a file `config/local.js`:

```
cp config/default.js config/local.js
```

Although config options are described, there is more information in:

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
		 Config key `maxSearchAttempts` sets the number of times an episode will be searched for a torrent before considering its dead.

   2. **Download available magnets**
   
	 	Episodes marked as not downloaded and have a torrent magnet start downloading.

3. **Start new cycle** 
   
	 If *config key* `reset` is set to true, and there are new episodes to
	 search, new cycle is started.
	 --> if not torrents are found, it will keep searching **forever**.


# Limitations

This project is ment to automatically download latest episodes of tv shows, so them are expected to be alive (lots of peers). Downloading past episodes is slower
and may cause the app to hang, since it waits for the torrents to download before starting new downloads (see lifecycle).

# TO DO's

## v1.1

- [ ] Tests

## v2
- [ ] Event emitters?
- [ ] Create separate DDBB for shows info (committed), and episodes
- [ ] Globally available / CLI 
  - [ ] Add / remove shows
  - [ ] Add / remove seasons
  - [x] Launch vlc for selected episode
    - [x] Filter episodes that are marked as downloaded
    - [ ] Mark episode as watched
      - [x] detect vlc video finished
      - [x] differenciate beetween video finished and user closing vlc
      - [ ] inquire and set to db
      - [ ] clean code
  - [ ] Clear searchAttempts option
- [ ] Change output / debug
  - [x] Add output module
  - [ ] Migrate module
- [ ] Option of downloading complete seasons
  - [ ] Show info search --> episode details
- [ ] Secure file path reading using path library


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

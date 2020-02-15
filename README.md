# TV SHOW TRACKER

Stop searching for torrents, simply select which shows you want to track and new episodes will be automatically dowloaded as soon
as they're available!

This project is ment to automatically download latest episodes of tv shows, not downloading torrents in bulk (although searching for complete season torrents is in the roadmap), there are softwares for that.


- [TV SHOW TRACKER](#tv-show-tracker)
	- [Usage](#usage)
		- [Tip](#tip)
	- [Lifecycle](#lifecycle)
- [TO DO's](#to-dos)
	- [v1](#v1)
	- [v2](#v2)

## Usage

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
npm run start
```

TV Show schedule is crawled from an online web and available tv shows are populated in the database: `database/db.json`. 

Edit the file `config/local.js` to **select the shows want to track**:

```javascript
{
	...
	selectedShows: [
		'doctor who',
		'the magicians',
		'brooklyn nine nine',
		...
	]
	...
}
```

Every time the app is launched, checks for new aired episodes in the schedule so you don't have to track every tv show, searches for the magnet and downloads it.

### Tip

If your terminal allows you to create aliases for commands (like zsh), adding: 

```bash
alias checkTvShows="cd ~/code/tv-show-tracker/; npm run start;"
```

to your `.zshrc` file (or similar) will allow you to run the app opening a terminal and doing: `checkTvShows`.

## Lifecycle

1. Update calendar
2. Start cycle
   1. Search for new torrents
   2. Download available magnets
3. Go to 2.

# TO DO's

## v1

- [ ] Tests
- [ ] Calendar force update after X days
- [ ] Storage system
  - [x] Parse file names
    - [x] change showtitle property of episodes to parse name with external module
    - [x] shows stored as lowercase
- [x] Config file
  - [x] Search limit
  - [x] Restart lifecycle
- [x] Figure out which torrent search provider is giving timeout and disable it to speed up process
- [x] Restart lifecycle to keep searching for torrents while dowloading

## v2
- [ ] Globally available / CLI 
  - [ ] Add / remove shows
  - [ ] Add / remove seasons
  - [ ] Launch vlc for selected episode
- [ ] Option of downloading complete seasons
  - [ ] Show info search --> episode details

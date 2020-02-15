# TV SHOW TRACKER

Stop searching for torrents, simply select which shows you want to track and new episodes will be automatically dowloaded as soon
as they're available!

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

Edit this file to **select the shows want to track**:

```javascript
{
  "shows": [
    // ...
    {
      title: "Doctro Who",
      selected: true
    },
    //...
  ]
}
```

Every time the app is launched, checks for new aired episodes in the schedule so you don't have to track every tv show, searches for the magnet and downloads it.

# Tips

If your terminal allows you to create aliases for commands (like zsh), adding: 

```bash
alias checkTvShows="cd ~/code/tv-show-tracker/; npm run start;"
```

to your `.zshrc` file (or similar) will allow you to run the app opening a terminal and doing: `checkTvShows`.


# TO DO's

# v1

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

# v2
- [ ] Globally available / CLI 
  - [ ] Add / remove shows
  - [ ] Add / remove seasons
  - [ ] Launch vlc for selected episode
- [ ] Option of downloading complete seasons
  - [ ] Show info search --> episode details

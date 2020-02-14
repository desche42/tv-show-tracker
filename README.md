# TV TORRENT AUTO DOWNLOADER

Stop searching for torrents, select which shows you want to track and new episodes will be waiting for you!

## Usage

Clone the repo and install node dependencies:

```
npm i

// lots of console info
npm run debug

// redable console info
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


# TO DO's

- Tests
  
- Select shows easily
  
- Option of download whole seasons

- Figure out which torrent search provider is giving timeout and disable it to speed up process

# TV TORRENT AUTO DOWNLOADER

Stop searching for torrents, select which shows you want to track and new episodes will be waiting for you!

## Usage

```
npm i
npm run start
```

The first time the app is launched, database will populate with available tv shows, modify the file `database/db.json` and set `"selected": true` to any show:

```javascript
{
  "shows": {
    // ...
    "Fringe": {
      selected: true
    }
    //...
  }
}
```


TV Show schedule is crawled from an online web and available tv shows are populated in `data/availableShows.json`.

Select your favorites by setting the value to true and episodes will be saved to `data/selectedShows/<show>`


## TO DO's

- Tests
- Select shows easily
- Option of download whole seasons
- Check last schedule update date to avoid unnecesary API calls as schedule most probably won't change (maybe add --force-schedule-update option)
- Figure out which torrent search provider is giving timeout and disable it to speed up process

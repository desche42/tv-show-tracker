# Search episodes

`torrent-search-api ` is used.

Module exports a function that accepts an array of episodes to search.

**If several torrents are found**, highest size is selected and stored in episode's db file:

## Torrent found episode 
```javascript
    {
      ...
      torrent: {
        title: "doctor.who.2005.s12e06.720p.hdtv.x264-mtb[eztv]",
        peers: 59,
        seeds: 354,
        time: "1 week",
        size: "911.08 MB",
        magnet: "magnet:?...",
        desc: "http://extratorrent.a...",
        provider: "ExtraTorrent"
      },
      ...
    }
```



# Search episodes

`torrent-search-api` is used.

Module exports a function that accepts an array of episodes to search.

All torrents are checked:

1. if has a magnet link
2. title is parsed to extract episode info
   1. show
   2. season
   3. episode
3. if show is among selected episode is
   1. updatad if exists in db
   2. created if not

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


[Main Page](../../README.md)



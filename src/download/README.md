# Download torrents

Downloads all given torrents to path configured (defaults to `database/downloads`) and classified by show and episode.

For example, episode `3`, season `12` of `doctor who` would be saved into

```
database/downloads/doctor who/S12E03/<file downloaded>.avi
```

# Limitations

Returns a promise that resolves when all torrents have been downloaded, so if one torent has few seeds, app will hang.


[Main Page](../../README.md)

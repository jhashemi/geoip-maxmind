# geoip-maxmind
#### Simple NodeJS for GeoIP with Maxmind GeoLite2 (or GeoIP2) mmdb database

Gives JSON results as this one:
```json
  {
  ip: "69.171.224.1",
  country_short: "US",
  country_long: "Estados Unidos",
  region: "California",
  latitude: 37.459,
  longitude: -122.1781
  }
```

Try it easily with Docker (example):

```
> docker pull supermasita/geoip-maxmind
> docker run -d -p 80:80 -p 8080:8080 --name="geoip" --hostname="geoip" -t supermasita/geoip-maxmind
```

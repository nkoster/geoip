"IPV4 address to location" service in NodeJS.
Responses in JSON.
The IP location database in CSV format was fetched from [ip2location](http://lite.ip2location.com).

Install:

```
git clone https://github.com/nkoster/geoip
cd geoip
npm i
gunzip IP2LOCATION-LITE-DB11.CSV.gz
node main.js IP2LOCATION-LITE-DB11.CSV
```

Usage:

for example, with `curl`
```
curl -s localhost:10000/223.75.6.66
```
response
```json
{"ip":"223.75.6.66","countryCode":"CN","country":"China","state":"Hubei","city":"Wuhan"}
```

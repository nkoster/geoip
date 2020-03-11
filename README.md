Fast IP address to location service.

Responses are in JSON.

The IP location database in CSV format was downloaded from [http://lite.ip2location.com](ip2location).

Install:

```
git clone https://github.com/nkoster/geoip
cd geoip
npm i
gunzip IP2LOCATION-LITE-DB11.CSV.gz
node main.js IP2LOCATION-LITE-DB11.CSV
```

Usage:

for example, with ```curl```:
```
curl -s localhost:10000/223.109.6.66
```
which should give a response like this:
```
{"ip":"223.109.6.66","countryCode":"CN","country":"China","state":"Beijing","city":"Beijing"}
```

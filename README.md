"IPV4 address to location" service in NodeJS.
Responses in JSON.
The IP location database in CSV format was fetched from [ip2location](http://lite.ip2location.com).

Install:

```
git clone https://github.com/nkoster/geoip
cd geoip
npm i
curl -sLO https://w3b.net/IP2LOCATION-LITE-DB11.CSV
node main.js IP2LOCATION-LITE-DB11.CSV
```

Usage:

for example, with `curl`
```
curl -s localhost:10000/223.75.6.66
```
response
```json
{"ip":"223.75.6.66","countryCode":"CN","country":"China","state":"Hubei","city":"Wuhan","latitude":"30.583330","longitude":"114.266670"}
```

Online test version is here: ```curl -s https://geoip.w3b.net/223.75.6.66```

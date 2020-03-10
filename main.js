const
    log = false,
    app = require('express')(),
    http = require('http').createServer(app),
    geoip = require('./util/geoip'),
    readline = require('readline'),
    fs = require('fs'),
    csv = './IP2LOCATION-LITE-DB11.CSV',
    csvTotalLines = 2781731,
    reader = readline.createInterface({
        input: fs.createReadStream(csv),
        console: false
    }),
    splits = 100,
    split = Math.floor(csvTotalLines / splits),
    totalArrays = Math.floor(csvTotalLines / split)

console.log(split)

let
    dbArray = [],
    lineCounter = 0,
    dbLoaded = false

for (let i = 0; i < totalArrays; i++) {
    dbArray[i] = []
}

reader.on('line', line => {
    lineCounter++
    line = line.replace(/"/g, '')
    const
        [ipStartStr, ipEndStr, countryCode, country, state, city] = line.split(','),
        [ipStart, ipEnd] = [parseInt(ipStartStr), parseInt(ipEndStr)]
    let arrayCounter = Math.floor(lineCounter / split)
    if (lineCounter < split * (arrayCounter + 1)) {
        if (typeof dbArray[arrayCounter] != 'undefined')
            dbArray[arrayCounter].push({ipStart, ipEnd, countryCode, country, state, city})
    }
})

reader.on('close', _ => {
    console.log('db loaded')
    dbLoaded = true
})

app.get('/:ip', (req, res) => {
    if (dbLoaded) {
        const
            ipInt = geoip.ip2int(req.params.ip),
            ipIntFilter = el => ipInt >= parseInt(el.ipStart) && ipInt <= parseInt(el.ipEnd)
        let hit
        dbArray.forEach(arr => {
            if (ipInt >= arr[0].ipStart && ipInt <= arr[arr.length - 1].ipEnd) {
                hit = arr.find(ipIntFilter)
            }
        })
        res.setHeader('Content-Type', 'application/json')
        if (typeof hit === 'object') {
            log && console.log(new Date(), req.params.ip, hit.countryCode)
            res.end(JSON.stringify({
                ip: req.params.ip,
                countryCode: hit.countryCode,
                country: hit.country,
                state: hit.state,
                city: hit.city
            }))
        } else {
            res.end(JSON.stringify({
                ip: req.params.ip,
                countryCode: '-',
                country: '-',
                state: '-',
                city: '-'
            }))
        }
    } else {
        res.end('Please try again later.')
    }
})

http.listen(10000, _ => {
    console.log('http listening on :10000')
})

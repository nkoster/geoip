const
    log = false,
    app = require('express')(),
    http = require('http').createServer(app),
    geoip = require('./util/geoip'),
    readline = require('readline'),
    fs = require('fs'),
    csv = './IP2LOCATION-LITE-DB11.CSV',
    reader = readline.createInterface({
        input: fs.createReadStream(csv),
        console: false
    }),
    split = 695432

let
    dbArrayA = [], dbArrayB = [], dbArrayC = [], dbArrayD = [],
    lineCounter = 0,
    dbLoaded = false

reader.on('line', line => {
    lineCounter++
    line = line.replace(/"/g, '')
    const
        [ipStartStr, ipEndStr, countryCode, country, state, city] = line.split(','),
        [ipStart, ipEnd] = [parseInt(ipStartStr), parseInt(ipEndStr)]
    if (lineCounter < split) {
        dbArrayA.push({ipStart, ipEnd, countryCode, country, state, city})
    } else if (lineCounter < split * 2) {
        dbArrayB.push({ipStart, ipEnd, countryCode, country, state, city})
    } else if (lineCounter < split * 3) {
        dbArrayC.push({ipStart, ipEnd, countryCode, country, state, city})
    } else if (lineCounter < split * 4) {
        dbArrayD.push({ipStart, ipEnd, countryCode, country, state, city})
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
        if (ipInt <= dbArrayA[dbArrayA.length - 1].ipEnd) {
            hit = dbArrayA.find(ipIntFilter)
        } else if (ipInt <= dbArrayB[dbArrayB.length - 1].ipEnd) {
            hit = dbArrayB.find(ipIntFilter)
        } else if (ipInt <= dbArrayC[dbArrayC.length - 1].ipEnd) {
            hit = dbArrayC.find(ipIntFilter)
        } else if (ipInt <= dbArrayD[dbArrayD.length - 1].ipEnd) {
            hit = dbArrayD.find(ipIntFilter)
        }
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

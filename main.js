const
    app = require('express')(),
    http = require('http').createServer(app),
    geoip = require('./util/geoip'),
    readline = require('readline'),
    fs = require('fs'),
    csv = './IP2LOCATION-LITE-DB11.CSV',
    reader = readline.createInterface({
        input: fs.createReadStream(csv),
        console: false
    })

let dbArray = []

reader.on('line', line => {
    line = line.replace(/"/g, '')
    const
        [ipStartStr, ipEndStr, countryCode, country, state, city] = line.split(','),
        [ipStart, ipEnd] = [parseInt(ipStartStr), parseInt(ipEndStr)]
    dbArray.push({ipStart, ipEnd, countryCode, country, state, city})
})

reader.on('close', _ => {
    console.log('db loaded')
})

app.get('/geoip/:ip', (req, res) => {
    const
        ipInt = geoip.ip2int(req.params.ip),
        ipIntFilter = el => ipInt >= parseInt(el.ipStart) && ipInt <= parseInt(el.ipEnd),
        hit = dbArray.find(ipIntFilter)
    res.setHeader('Content-Type', 'application/json')
    if (hit) {
        res.end(JSON.stringify({
            ip: req.params.ip,
            countryCode: hit.countryCode,
            country: hit.country,
            state: hit.state,
            city: hit.city
        }))    
    } else {
        res.end('----')
    }
})

http.listen(10000, _ => {
    console.log('http listening on :10000')
})

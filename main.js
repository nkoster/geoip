const { exec } = require("child_process")

exec(`cat ${process.argv[2]} | wc -l`, (_, stdout) => {
    if (parseInt(stdout) > 1) {

        csvTotalLines = parseInt(stdout)
        console.log('loading', csvTotalLines, 'lines')

        const
            log = false,
            app = require('express')(),
            http = require('http').createServer(app),
            httpPort = 10000,
            geoip = require('./util/geoip'),
            readline = require('readline'),
            fs = require('fs'),
            csv = process.argv[2],
            reader = readline.createInterface({
                input: fs.createReadStream(csv),
                console: false
            }),
            splits = 100,
            split = Math.floor(csvTotalLines / splits),
            totalArrays = Math.floor(csvTotalLines / split)
        
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
            console.log('db loaded in', dbArray.length, 'arrays')
            dbLoaded = true
        })
        
        app.get('/:ip', (req, res) => {
            if (dbLoaded) {
                const
                    ipInt = geoip.ip2int(req.params.ip),
                    ipIntFilter = el => ipInt >= parseInt(el.ipStart) && ipInt <= parseInt(el.ipEnd)
                let hit
                dbArray.some(arr => {
                    if (ipInt >= arr[0].ipStart && ipInt <= arr[arr.length - 1].ipEnd) {
                        hit = arr.find(ipIntFilter)
                        return true
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
        
        http.listen(httpPort, _ => {
            console.log('geoip listening on port', httpPort)
        })
    
    }
})

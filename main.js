const
    { exec } = require("child_process"),
    process = require('process')

exec(`cat ${process.argv[2]} | wc -l`, (_, stdout) => {
    if (parseInt(stdout) > 1) {
        const
            rdl = require('readline'),
            std = process.stdout,
            spinners = [],
            currentSpinner = 0,
            csvTotalLines = parseInt(stdout)
        spinners.push(String.raw`⣾⣽⣻⢿⡿⣟⣯⣷`.split('').reverse())
        spinners.push(String.raw`-\|/`.split(''))
        let index = 0
        const spinner = setInterval(_ => {
            let spin = spinners[currentSpinner][index]
            if (typeof spin === 'undefined') {
                index = 0
                spin = spinners[currentSpinner][index]
            }
            std.write(`loading \u001b[33m${csvTotalLines}\u001b[39m lines ${spin}`)
            rdl.cursorTo(std, 0)
            index = index >= spinners[currentSpinner].length ? 0 : index + 1
        }, 100)

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
                [ipStart, ipEnd] = [parseInt(ipStartStr), parseInt(ipEndStr)],
                arrayCounter = Math.floor(lineCounter / split)
            if (lineCounter < split * (arrayCounter + 1)) {
                if (typeof dbArray[arrayCounter] != 'undefined')
                    dbArray[arrayCounter].push({ipStart, ipEnd, countryCode, country, state, city})
            }
        })
        
        reader.on('close', _ => {
            console.log(
                `\u001b[33m${csvTotalLines}\u001b[39m lines loaded`,
                `in \u001b[33m${dbArray.length}\u001b[39m arrays`
            )
            dbLoaded = true
            clearInterval(spinner)
        })
        
        app.get('/:ip', (req, res) => {
            console.log(
                new Date().toISOString(),
                req.headers['x-forwarded-for'] || req.connection.remoteAddress,
                req.params.ip
            )
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
            console.log(`geoip listening on port \u001b[33m${httpPort}\u001b[39m`)
        })
    
    }
})

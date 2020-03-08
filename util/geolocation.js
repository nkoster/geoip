module.exports = (ip, csv, emmitter) => {

    const
        readline = require('readline'),
        fs = require('fs'),
        geoip = require('./geoip'),
        ipInt = geoip.ip2int(ip),
        readInterface = readline.createInterface({
            input: fs.createReadStream(csv),
            console: false
        })

    readInterface.on('line', line => {
        line = line.replace(/"/g, '')
        const [ipStartStr, ipEndStr, countryCode, country, state, city] = line.split(',')
        const ipStart = parseInt(ipStartStr)
        const ipEnd = parseInt(ipEndStr)
        if (ipInt >= ipStart && ipInt <= ipEnd) {
            readInterface.close()
            emmitter.emit('receive', JSON.stringify({
                ip,
                countryCode,
                country,
                state,
                city
            }))
        }
    })

}

const
    events = require('events'),
    emmitter = new events.EventEmitter(),
    dataReceive = data => {
        console.log(data)
    },
    geoLoc = require('./util/geolocation'),
    ip = process.argv[2] || '194.109.6.66'

emmitter.on('receive', dataReceive)
emmitter.emit('connect')

geoLoc(ip, './IP2LOCATION-LITE-DB11.CSV', emmitter)

const
    events = require('events'),
    emmitter = new events.EventEmitter(),
    geoLoc = require('./util/geolocation'),
    ip = process.argv[2] || '194.109.6.66'

emmitter.on('receive', data => console.log(data))
emmitter.emit('connect')

geoLoc(ip, './IP2LOCATION-LITE-DB11.CSV', emmitter)

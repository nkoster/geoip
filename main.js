const
    events = require('events'),
    emmitter = new events.EventEmitter(),
    app = require('express')(),
    http = require('http').createServer(app),
    geoLoc = require('./util/geolocation')

app.get('/geoip/:ip', (req, res) => {
    geoLoc(req.params.ip, './IP2LOCATION-LITE-DB11.CSV', emmitter)
    emmitter.on('receive', data => {
        res.setHeader('Content-Type', 'application/json')
        res.end(data)
    })
})

http.listen(9999, _ => {
    console.log('http listening on :9999')
})

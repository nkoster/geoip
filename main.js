const
    events = require('events'),
    app = require('express')(),
    http = require('http').createServer(app),
    geoLoc = require('./util/geolocation')

app.get('/geoip/:ip', (req, res) => {
    const emmitter = new events.EventEmitter()
    geoLoc(req.params.ip, './IP2LOCATION-LITE-DB11.CSV', emmitter)
    emmitter.on('receive', data => {
        console.log(req.params.ip, data)
        res.setHeader('Content-Type', 'application/json')
        res.end(data)
        emmitter.removeAllListeners
    })
})

http.listen(10000, _ => {
    console.log('http listening on :10000')
})

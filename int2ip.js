const geoip = require('./util/geoip')

console.log(geoip.int2ip(process.argv[2]))

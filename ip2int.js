const geoip = require('./util/geoip')

const arg = process.argv[2] || ''

console.log(geoip.ip2int(arg))

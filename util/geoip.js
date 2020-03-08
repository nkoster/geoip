exports.int2ip = i =>
    (i>>>24) + '.' + (i>>16 & 255) + '.' + (i>>8 & 255) + '.' + (i & 255)

exports.ip2int = ip =>
    ip.split('.').reduce((i, octet) => (i<<8) + parseInt(octet, 10), 0) >>> 0

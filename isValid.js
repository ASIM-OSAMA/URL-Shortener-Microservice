const dns = require('dns')

// function isValidUrl (url) {
const urlfilter = url => {
  const protocolRegex = /^(https?:\/\/)/
  const hostRegex =
    /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/

  if (!protocolRegex.test(url)) {
    return false
  }

  const host = url.match(protocolRegex)[1].replace(/:\/\//, '')

  return new Promise((resolve, reject) => {
    dns.lookup(host, err => {
      if (err) {
        resolve(false)
      } else {
        resolve(hostRegex.test(host))
      }
    })
  })
}

const isValidUrl = (req, res, next) => {
  const url = req.body.url
  if (!urlfilter(url)) {
    return res.status(500).json({ error: 'invalid url' })
  } else {
    next()
  }
}

module.exports = isValidUrl

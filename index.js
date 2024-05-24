require('dotenv').config()
const express = require('express')
const cors = require('cors')
const isValidUrl = require('./isValid')
const app = express()

// Basic Configuration
const port = process.env.PORT || 3000

app.use(cors())

app.use('/public', express.static(`${process.cwd()}/public`))
// app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const data = {
  freecodecamp: { original_url: 'https://freecodecamp.org', short_url: 1 },
  google: { original_url: 'https://google.com', short_url: 2 }
}

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html')
})

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' })
})

// Second API
app.post('/api/shorturl', isValidUrl, (req, res) => {
  const url = req.body.url

  // console.log(Number(url))

  for (const key in data) {
    const element = data[key]
    const element_original_url = data[key].original_url
    const element_short_url = data[key].short_url

    const convert = Number(url)
    // console.log(isNaN(convert))

    if (isNaN(convert) === true) {
      if (element_original_url === url) {
        return res.json(element)
      }
    }
    if (element_short_url === Number(url)) {
      return res.json(element)
    }
  }

  return res.status(404).json('No Match!')
})

// Third API
app.get('/api/shorturl/:url', (req, res) => {
  url = req.params.url
  const convert = Number(url)

  try {
    for (const key in data) {
      const element = data[key]
      const element_short_url = data[key].short_url

      if (element_short_url === convert) {
        return res.redirect(element.original_url)
        // return res.redirect('www.google.com')
      }
    }
    return res.status(404).json('No Match!')
  } catch (error) {
    console.log('error')
  }
})

app.listen(port, function () {
  console.log(`Listening on port ${port}`)
})

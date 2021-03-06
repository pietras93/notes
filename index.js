'use strict'

const express = require('express')
const compression = require('compression')
const bodyParser = require('body-parser')
const jsonpExpress = require('jsonp-express')
const config = require('./config.json')
const routes = require('./routes')
const app = express()
 
// Configure express
app.use(compression())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(jsonpExpress)

/**
 * Ignore requests for unsupported format
 * Set req.format to method which should be used for response
 * for later use
 */
app.use((req, res, next) => {
  
  if (req.query.format && req.query.format.indexOf('json') !== 0) {
    return res.status(400).json({
      'code': 'E101',
      'message': 'Unsupported format'
    })
  }

  if (req.query.callback && req.query.format === 'jsonp') {
    req.format = 'jsonp'
  } else {
    req.format = 'json'
  }

  return next()
})

// Setup routes
app.use('/v1', routes)

// Unknown routes
app.use('*', (req, res) => {

  return res.status(404)[req.format]({
    'code': 404,
    'message': 'Unknown route'
  })
})

// Error handler
app.use((err, req, res) => {

  // Some other logging utility here would be useful
  console.error(err)

  return res.status(500)[req.format]({
    'message': err.message || 'Internal server error'
  })
})

// Create server
app.listen(config.port, () => {
  console.log(`Listening @ http://localhost:${config.port}/`)
})

// Export app for testing
module.exports = app
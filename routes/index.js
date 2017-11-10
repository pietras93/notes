'use strict'

const express = require('express')
const router  = express.Router()
const notesRoutes = require('./notes')

/**
 * In larger project iterating through files inside routes dir and creating path for each would
 * be better than doing it manually for each. However, in case of 1 file is counter productive.
 * Same goes for models.
 */

// Notes routes
router.use('/notes', notesRoutes)

// Ping route
router.get('/ping', (req, res) => {

  return res[req.format]({ 'pong': true })
})

module.exports = router
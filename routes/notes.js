'use strict'

const config = require('../config.json')
const models = require('../models')
const express = require('express')
const router = express.Router()

/**
 * List notes, paging can be used with page querystring, starts with 0
 * Page size can be changed using size querystring, defaults are in config.json
 */
router.get('/', async (req, res, next) => {
  
  try {
    
    let params = {
      offset: 0,
      limit: config.pageSize
    }

    let size = config.pageSize
    let page = 0

    // Alternative page size
    if (req.query.size) {
      
      size = parseInt(req.query.size)
      
      if (isNaN(size) || size <= 0) {
        return res.status(400)[req.format]({
          'code': 'E001',
          'message': 'Page size must be a positive number'
        })
      }
      
      params.limit = size
    }

    // Pagination
    if (req.query.page) {

      page = parseInt(req.query.page)

      if (isNaN(page) || page <= 0) {
        return res.status(400)[req.format]({
          'code': 'E002',
          'message': 'Page must be a positive number'
        })
      }

      params.offset = (page - 1) * params.limit
    }
    
    let notes = await models.Notes.findAll(params)

    /**
     * Depeneding on convention this could be done:
     * 1) Using if (req.format === 'jsonp') for every route
     * 2) Attaching response to req object and chaining it via next to formatting function
     * 3) Like here. Hardest to grasp, but best performance-wise
     */
    return res[req.format]({
      'count': notes.length,
      'results': notes
    })
  } catch(err) {
    return next(err)
  }
})

// Get note by id
router.get('/:noteId', (req, res, next) => {
  
  return res[req.format](req.note)
})

// Create new note and return it
router.post('/', async (req, res, next) => {

  try {

    if (!req.body.title) {
      return res.status(400)[req.format]({
        'code': 'E011',
        'message': 'Note title is required'
      })
    }

    if (!req.body.message) {
      return res.status(400)[req.format]({
        'code': 'E012',
        'message': 'Note message is required'
      })
    }

    let created = await models.Notes.create(req.body)
    let note = await models.Notes.findById(created.id)

    return res[req.format](note)
  } catch(err) {
    return next(err)
  }
})

// Update note of given id and return
router.put('/:noteId', async (req, res, next) => {
  
  try {
    
    if (!(req.body.title || req.body.message)) {
      return res.status(400)[req.format]({
        'code': 'E021',
        'message': 'Note title or message is required'
      })
    }

    let body = {
      'title': req.body.title || req.note.title,
      'message': req.body.message || req.note.message
    }

    let updated = await models.Notes.update(body, { where: { id: req.note.id } })
    let note = await models.Notes.findById(req.note.id)

    return res[req.format](note)
  } catch(err) {
    return next(err)
  }
})

// Delete note of given id
router.delete('/:noteId', async (req, res, next) => {
  
  try {
    
    await models.Notes.destroy({ where: { id: req.note.id } })
    
    return res[req.format]({ 'success': true })
  } catch(err) {
    return next(err)
  }
})

// Find note by id, return 404 when none found, move to route function
router.param('noteId', async (req, res, next, id) => {
  
  try {
    
    let note = await models.Notes.findById(id)

    if (!note) {
      return res.status(404)[req.format]({
        'code': 404,
        'message': 'Element does not exist'
      })
    }
    
    req.note = note

    return next()
  } catch(err) {
    return next(err)
  }
})

module.exports = router
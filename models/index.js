'use strict'

const Sequelize = require('sequelize')
let db = {}

// Create DB
const isTest = process.env.NODE_ENV === 'test'
const sequelize = new Sequelize('notes', null, null, {
  dialect: 'sqlite',
  operatorsAliases: false,
  logging: isTest ? () => {} : console.log,
  storage: isTest ? './test.sqlite' : './db.sqlite'
})

// Ensure DB works
sequelize.authenticate()
.then(() => {

  // Similarly as with routes, iterating through dir content would be useful in large project
  db.Notes = sequelize.import('./notes.js')
})

module.exports = db
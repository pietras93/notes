'use strict'

const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../index')
const should = chai.should()
const models = require('../models')

const testTitle = 'Test'
const testTitle2 = 'Test2'
const testMessage = 'Lorem ipsum dolor sit amet'

chai.use(chaiHttp)

describe('Notes routes', () => {
  
  // Flush db
  before((done) => {
    
    setTimeout(() => {
      models.Notes.sync({ force: true }).then(() => {
        return done()
      }, done)
    }, 100)
  })

  describe('POST', () => {

    it('it should return validation error when no message provided', (done) => {
      
      chai.request(server)
      .post('/v1/notes')
      .send({ 'title': testTitle })
      .end((err, res) => {

        res.should.have.status(400)
        res.body.should.be.an('object')
        res.body.should.have.property('message').that.is.a('string').equal('Note message is required')
        res.body.should.have.property('code').that.is.a('string').equal('E012')
        
        return done()
      })
    })

    it('it should return validation error when no title provided', (done) => {
      
      chai.request(server)
      .post('/v1/notes')
      .send({ 'message': testMessage })
      .end((err, res) => {

        res.should.have.status(400)
        res.body.should.be.an('object')
        res.body.should.have.property('message').that.is.a('string').equal('Note title is required')
        res.body.should.have.property('code').that.is.a('string').equal('E011')
        
        return done()
      })
    })

    it('it should create and retrieve note', (done) => {
      
      chai.request(server)
      .post('/v1/notes')
      .send({
        'title': testTitle,
        'message': testMessage
      })
      .end((err, res) => {
        
        res.should.have.status(200)
        res.body.should.be.an('object')
        res.body.should.have.property('id').that.is.equal(1)
        res.body.should.have.property('title').that.is.equal(testTitle)
        res.body.should.have.property('message').that.is.equal(testMessage)
        
        return done()
      })
    })
  })
  
  describe('GET', () => {
    
    it('it should return list of notes', (done) => {
      
      chai.request(server)
      .get('/v1/notes')
      .end((err, res) => {
        
        res.should.have.status(200)
        res.body.should.be.an('object')
        res.body.should.have.property('count').that.is.a('number').equal(1)
        res.body.should.have.property('results').that.is.an('array').with.length(1)
        
        return done()
      })
    })

    it('it should return one note', (done) => {
      
      chai.request(server)
      .get('/v1/notes/1')
      .end((err, res) => {
        
        res.should.have.status(200)
        res.body.should.be.an('object')
        res.body.should.have.property('message').that.is.a('string').equal(testMessage)
        
        return done()
      })
    })

    it('it should return 404', (done) => {
      
      chai.request(server)
      .get('/v1/notes/2')
      .end((err, res) => {
        
        res.should.have.status(404)
        res.body.should.be.an('object')
        res.body.should.have.property('message').that.is.a('string').equal('Element does not exist')
        res.body.should.have.property('code').that.is.a('number').equal(404)
        
        return done()
      })
    })

    it('it should return a validation error on wrong page size', (done) => {
      
      chai.request(server)
      .get('/v1/notes')
      .query({ 'page': 1, 'size': 'a' })
      .end((err, res) => {
        
        res.should.have.status(400)
        res.body.should.be.an('object')
        res.body.should.have.property('message').that.is.a('string').equal('Page size must be a positive number')
        res.body.should.have.property('code').that.is.a('string').equal('E001')
        
        return done()
      })
    })

    it('it should return a validation error on wrong page number', (done) => {
      
      chai.request(server)
      .get('/v1/notes')
      .query({ 'page': -1, 'size': 10 })
      .end((err, res) => {
        
        res.should.have.status(400)
        res.body.should.be.an('object')
        res.body.should.have.property('message').that.is.a('string').equal('Page must be a positive number')
        res.body.should.have.property('code').that.is.a('string').equal('E002')
        
        return done()
      })
    })
  })

  describe('PUT', () => {
    
    it('it should update and retieve note', (done) => {
      
      chai.request(server)
      .put('/v1/notes/1')
      .send({ 'title': testTitle2 })
      .end((err, res) => {
        
        res.should.have.status(200)
        res.body.should.be.an('object')
        res.body.should.have.property('title').that.is.a('string').equal(testTitle2)
        
        return done()
      })
    })

    it('it should return error when neither of title and message is present', (done) => {
      
      chai.request(server)
      .put('/v1/notes/1')
      .send({ 'random': 'qwerty' })
      .end((err, res) => {
        
        res.should.have.status(400)
        res.body.should.be.an('object')
        res.body.should.have.property('code').that.is.a('string').equal('E021')
        res.body.should.have.property('message').that.is.a('string').equal('Note title or message is required')
        
        return done()
      })
    })
  })

  describe('DELETE', () => {
    
    it('it should delete a note', (done) => {

      chai.request(server)
      .delete('/v1/notes/1')
      .end((err, res) => {
        
        res.should.have.status(200)
        res.body.should.be.an('object')
        res.body.should.have.property('success').that.is.a('boolean').equal(true)
        
        return done()
      })
    })

    it('it should have cleared db', (done) => {

      chai.request(server)
      .get('/v1/notes')
      .end((err, res) => {
        
        res.should.have.status(200)
        res.body.should.be.an('object')
        res.body.should.have.property('count').that.is.a('number').equal(0)
        
        return done()
      })
    })
  })
})
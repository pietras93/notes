'use strict'

const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../index')
const should = chai.should()

chai.use(chaiHttp)

describe('Ping route', () => {

  describe('GET', () => {
    
    it('it should return pong', (done) => {

      chai.request(server)
      .get('/v1/ping')
      .end((err, res) => {
        
        res.should.have.status(200)
        res.body.should.be.an('object')
        res.body.should.have.property('pong').that.is.a('boolean').equal(true)
        
        return done()
      })
    })

    it('it should return jsonp response', (done) => {

      chai.request(server)
      .get('/v1/ping')
      .query({ 'format': 'jsonp', 'callback': 'cb' })
      .end((err, res) => {
        
        res.type.should.equal('script/javascript')
        res.should.have.status(200)
        
        return done()
      })
    })

    it('it should return unsupported format response', (done) => {

      chai.request(server)
      .get('/v1/ping')
      .query({ 'format': 'xml' })
      .end((err, res) => {
        
        res.should.have.status(400)
        res.body.should.have.property('message').that.is.a('string').equal('Unsupported format')
        res.body.should.have.property('code').that.is.a('string').equal('E101')
        
        return done()
      })
    })
  })
})
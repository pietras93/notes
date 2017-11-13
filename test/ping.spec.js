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
  })
})
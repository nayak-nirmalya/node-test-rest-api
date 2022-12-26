const expect = require('chai').expect
const jwt = require('jsonwebtoken')
const sinon = require('sinon')

const authMiddleware = require('../middleware/is-auth')

describe('Auth Middleware', () => {
  it('should throw an error if no authorization header is present', () => {
    const req = {
      get: function () {
        return null
      },
    }
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw(
      'Not authenticated.',
    )
  })

  it('should throw an error if the authorization header is only one string', () => {
    const req = {
      get: function () {
        return 'STRING'
      },
    }
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw()
  })

  it('should yield a userId after decoding the token', () => {
    const req = {
      get: function (headerName) {
        return 'Bearer STRING_VALID'
      },
    }
    sinon.stub(jwt, 'verify')
    jwt.verify.returns({ userId: 'user-id-valid' })
    authMiddleware(req, {}, () => {})
    expect(req).to.have.a.property('userId')
    expect(req).to.have.a.property('userId', 'user-id-valid')
    jwt.verify.restore()
  })

  it('should thow an error if the token can not be verified', () => {
    const req = {
      get: function () {
        return 'Bearer STRING'
      },
    }
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw()
  })
})

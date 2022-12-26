const expect = require('chai').expect

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
})

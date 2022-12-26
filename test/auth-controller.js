const expect = require('chai').expect
const sinon = require('sinon')
const mongoose = require('mongoose')

const User = require('../models/user')
const AuthController = require('../controllers/auth')

describe('Auth Controller - LogIn', () => {
  it('should throw an error with code 500 if accessing db fails', (done) => {
    sinon.stub(User, 'findOne')
    User.findOne.throws()

    const req = {
      body: {
        email: 'test@test.com',
        password: 'password',
      },
    }
    AuthController.login(req, {}, () => {}).then((result) => {
      expect(result).to.be.an('error')
      expect(result).to.have.property('statusCode', 500)
      done()
    })

    User.findOne.restore()
  })

  it('should send a response with valid user status for an existing user', (done) => {
    mongoose
      .connect(
        'mongodb+srv://nirmalya:nirmalya@cluster.a9tjk7u.mongodb.net/test-message',
      )
      .then((result) => {
        const user = new User({
          _id: '639c64828560d31be0576683',
          email: 'test@test.com',
          password: 'password',
          name: 'Test',
          posts: [],
        })
        return user.save()
      })
      .then(() => {
        const req = {
          userId: '639c64828560d31be0576683',
        }
        const res = {
          statusCode: 500,
          userStatus: null,
          status: function (code) {
            this.statusCode = code
            return this
          },
          json: function (data) {
            this.userStatus = data.status
          },
        }
        AuthController.getUserStatus(req, res, () => {}).then(() => {
          expect(res.statusCode).to.be.equal(200)
          expect(res.userStatus).to.be.equal('I am new!')
          User.deleteMany({})
            .then(() => {
              return mongoose.disconnect()
            })
            .then(() => done())
        })
      })
      .catch((err) => console.log(err))
  })
})

const expect = require('chai').expect
const sinon = require('sinon')
const mongoose = require('mongoose')

const User = require('../models/user')
const FeedController = require('../controllers/feed')

describe('Feed Controller', () => {
  before(function (done) {
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
      .then(() => done())
  })

  it('should add a created post to the posts of the creator', (done) => {
    const req = {
      body: {
        title: 'Test Post',
        content: 'Testing Post!',
      },
      file: {
        path: 'filepath',
      },
      userId: '639c64828560d31be0576683',
    }

    const res = {
      status: function () {
        return this
      },
      json: function () {},
    }

    FeedController.createPost(req, res, () => {}).then((savedUser) => {
      expect(savedUser).to.have.property('posts')
      expect(savedUser.posts).to.have.length(1)
      done()
    })
  })

  after(function (done) {
    User.deleteMany({})
      .then(() => {
        return mongoose.disconnect()
      })
      .then(() => done())
  })
})

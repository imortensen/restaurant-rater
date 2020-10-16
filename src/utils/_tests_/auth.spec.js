import { User } from '../../resources/user/user.model'
import { newToken, signup, verifyToken, signin, protect } from '../auth'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import config from '../../config'

describe('Authentication: ', () => {
  describe('newToken', () => {
    test('creates new jwt from user', () => {
      const id = 12345
      const token = newToken({ id })
      const user = jwt.verify(token, config.secrets.jwt)

      expect(user.id).toBe(id)
    })
  })

  describe('verify token', () => {
    test('verifies jwt token', async () => {
      const id = 12345
      const token = jwt.sign({ id }, config.secrets.jwt)
      const user = await verifyToken(token)
      expect(user.id).toBe(id)
    })
  })

  describe('sign up', () => {
    test('creates a new user and returns a token', async () => {
      expect.assertions(3)

      const req = {
        body: { username: 'newGuy', password: 'ajawvv', email: 'yolo@yes.com' }
      }
      const res = {
        status(status) {
          expect(status).toBe(201)
          return this
        },
        async send(result) {
          let user = await verifyToken(result.token)
          user = await User.findById(user.id)
            .lean()
            .exec()
          expect(user.email).toBe('yolo@yes.com')
          expect(user.username).toBe('newGuy')
        }
      }

      await signup(req, res)
    })

    test('email, username, and password required', async () => {
      expect.assertions(2)

      const req = { body: {} }
      const res = {
        status(status) {
          expect(status).toBe(400)
          return this
        },
        send(result) {
          expect(typeof result.message).toBe('string')
        }
      }

      await signup(req, res)
    })
  })

  describe('signin', () => {
    test('returns a token for the username and password', async () => {
      expect.assertions(2)

      const fields = {
        password: 'ajawvv',
        email: 'yolo@yes.com',
        username: 'johnny'
      }
      const savedUser = await User.create(fields)
      const req = { body: fields }
      const res = {
        status(status) {
          expect(status).toBe(201)
          return this
        },
        async send(result) {
          let user = await verifyToken(result.token)
          user = await User.findById(user.id)
            .lean()
            .exec()
          expect(user._id.toString()).toBe(savedUser._id.toString())
        }
      }

      await signin(req, res)
    })

    test('username and password required', async () => {
      expect.assertions(2)

      const req = { body: {} }
      const res = {
        status(status) {
          expect(status).toBe(400)
          return this
        },
        async send(result) {
          expect(typeof result.message).toBe('string')
        }
      }

      await signin(req, res)
    })

    test('invalid username', async () => {
      expect.assertions(2)

      const fields = {
        password: 'ajawvv',
        email: 'yolo@yes.com',
        username: 'johnny'
      }

      const badFields = {
        password: 'ajawvv',
        username: 'johnnny'
      }

      await User.create(fields)
      const req = { body: badFields }
      const res = {
        status(status) {
          expect(status).toBe(401)
          return this
        },
        send(result) {
          expect(typeof result.message).toBe('string')
        }
      }

      await signin(req, res)
    })

    test('password does not match', async () => {
      expect.assertions(2)

      const fields = {
        password: 'ajawvv',
        email: 'yolo@yes.com',
        username: 'johnny'
      }

      const badFields = {
        password: 'ajawvV',
        username: 'johnny'
      }

      await User.create(fields)
      const req = { body: badFields }
      const res = {
        status(status) {
          expect(status).toBe(401)
          return this
        },
        send(result) {
          expect(typeof result.message).toBe('string')
        }
      }

      await signin(req, res)
    })
  })

  describe('Protect', () => {
    test('Looks for Bearer token in headers', async () => {
      expect.assertions(2)

      const req = { headers: {} }
      const res = {
        status(status) {
          expect(status).toBe(401)
          return this
        },
        end() {
          expect(true).toBe(true)
        }
      }
      await protect(req, res)
    })

    test('Token must have correct prefix', async () => {
      expect.assertions(2)

      const req = { headers: { authorization: newToken({ id: 'afoiwejfiw' }) } }
      const res = {
        status(status) {
          expect(status).toBe(401)
          return this
        },
        end() {
          expect(true).toBe(true)
        }
      }
      await protect(req, res)
    })

    test('Token should map to a user', async () => {
      expect.assertions(2)
      const token = `Bearer ${newToken({ id: mongoose.Types.ObjectId() })}`

      const req = { headers: { authorization: token } }
      const res = {
        status(status) {
          expect(status).toBe(401)
          return this
        },
        end() {
          expect(true).toBe(true)
        }
      }
      await protect(req, res)
    })

    test('Gets user from token and passes it on', async () => {
      const user = await User.create({
        username: 'billy',
        email: 'billy@yahooo.com',
        password: 'jfoaww3'
      })

      const token = `Bearer ${newToken(user)}`
      const req = { headers: { authorization: token } }
      const next = () => {}
      await protect(req, {}, next)
      expect(req.user._id.toString()).toBe(user._id.toString())
      expect(req.user).not.toHaveProperty('password')
    })
  })
})

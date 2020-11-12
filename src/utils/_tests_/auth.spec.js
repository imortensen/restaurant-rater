import { User } from '../../resources/user/user.model'
import { newToken, signup, verifyToken, signin } from '../auth'
import jwt from 'jsonwebtoken'
import config from '../../config'

describe('Authentication: ', () => {
  describe('newToken', () => {
    test('creates new jwt from user', () => {
      const user = { id: '12345' }
      const token = newToken(user)
      const id = jwt.verify(token, config.secrets.jwt)

      expect(user.id).toBe(id)
    })
  })

  describe('sign up', () => {
    test('creates a new user and returns a token', async () => {
      expect.assertions(3)

      const req = {
        body: {
          authMethod: 'local',
          local: {
            username: 'newGuy',
            password: 'ajawvv',
            email: 'yolo@yes.com'
          }
        }
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
          expect(user.local.email).toBe('yolo@yes.com')
          expect(user.local.username).toBe('newGuy')
        }
      }

      await signup(req, res)
    })

    test('email, username, and password required', async () => {
      expect.assertions(2)

      const req = { body: { local: {} } }
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
        authMethod: 'local',
        local: {
          password: 'ajawvv',
          email: 'yolo@yes.com',
          username: 'johnny'
        }
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
        authMethod: 'local',
        local: {
          password: 'ajawvv',
          email: 'yolo@yes.com',
          username: 'johnny'
        }
      }

      const badFields = {
        local: {
          password: 'ajawvv',
          username: 'johnnny'
        }
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
        authMethod: 'local',
        local: {
          emai: 'test@test.com',
          password: 'ajawvv',
          username: 'johnny'
        }
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
})

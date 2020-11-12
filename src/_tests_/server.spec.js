import request from 'supertest'
import { app } from '../server'
import { User } from '../resources/user/user.model'
import { newToken } from '../utils/auth'
import mongoose from 'mongoose'

describe('API Authentication:', () => {
  let token
  beforeEach(async () => {
    const user = await User.create({
      authMethod: 'local',
      local: {
        email: 'a@a.com',
        password: 'hello',
        username: 'hellokitty'
      }
    })
    token = newToken(user)
  })

  describe('api auth', () => {
    test('api should be locked down', async () => {
      let response = await request(app).get('/api/restaurant')
      expect(response.statusCode).toBe(401)

      response = await request(app).get('/api/review')
      expect(response.statusCode).toBe(401)

      response = await request(app).get('/api/user')
      expect(response.statusCode).toBe(401)
    })

    test('passes with JWT', async () => {
      const jwt = `Bearer ${token}`
      const id = mongoose.Types.ObjectId()
      const results = await Promise.all([
        request(app)
          .get('/api/review')
          .set('Authorization', jwt),
        request(app)
          .get(`/api/review/myreviews`)
          .set('Authorization', jwt),
        request(app)
          .post('/api/review')
          .set('Authorization', jwt),
        request(app)
          .put(`/api/review/${id}`)
          .set('Authorization', jwt),
        request(app)
          .delete(`/api/review/${id}`)
          .set('Authorization', jwt)
      ])

      results.forEach(res => expect(res.statusCode).not.toBe(401))
    })
  })
})

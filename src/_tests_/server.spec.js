import request from 'supertest'
import { app } from '../server'
import { User } from '../resources/user/user.model'
import { newToken } from '../utils/auth'
import mongoose from 'mongoose'

describe('API Authentication:', () => {
  let token
  beforeEach(async () => {
    const user = await User.create({
      email: 'a@a.com',
      password: 'hello',
      username: 'hellokitty'
    })
    token = newToken(user)
  })

  describe('api auth', () => {
    test('api should be locked down', async () => {
      let response = await request(app).get('/api/restaurant')
      expect(response.statusCode).toBe(401)

      response = await request(app).get('/api/rating')
      expect(response.statusCode).toBe(401)

      response = await request(app).get('/api/user')
      expect(response.statusCode).toBe(401)
    })

    test('passes with JWT', async () => {
      const jwt = `Bearer ${token}`
      const id = mongoose.Types.ObjectId()
      const results = await Promise.all([
        request(app)
          .get('/api/rating')
          .set('Authorization', jwt),
        request(app)
          .get(`/api/rating/myRatings`)
          .set('Authorization', jwt),
        request(app)
          .post('/api/rating')
          .set('Authorization', jwt),
        request(app)
          .put(`/api/rating/${id}`)
          .set('Authorization', jwt),
        request(app)
          .delete(`/api/rating/${id}`)
          .set('Authorization', jwt)
      ])

      results.forEach(res => expect(res.statusCode).not.toBe(401))
    })
  })
})

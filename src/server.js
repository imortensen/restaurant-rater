import express from 'express'
import { json, urlencoded } from 'body-parser'
import morgan from 'morgan'
import config from './config'
import cors from 'cors'
import { connect } from './utils/db'
import { signup, signin, generateUserToken, secret } from './utils/auth'
import userRouter from './resources/user/user.router'
import restaurantRouter from './resources/restaurant/restaurant.router'
import reviewRouter from './resources/review/review.router'
import mapsRouter from './resources/maps/maps.router'
import passport from 'passport'
import { sign } from 'jsonwebtoken'

// require('./utils/jwt')
// require('./utils/google_auth')
require('./utils/passport')

export const app = express()
const passportJWT = passport.authenticate('jwt', { session: false })
// X-Powered-By is a header that tells the browser you are using Express
app.disable('x-powered-by')

if (config.seed) {
  require('./utils/seed')
}

app.use(cors())
app.use(json())
app.use(urlencoded({ extended: true }))
app.use(morgan('dev'))
// app.use(passport.initialize())

app.post('/signup', signup)
app.post('/signin', passport.authenticate('local', { session: false }), signin)

app.post(
  '/oauth/google',
  passport.authenticate('googleToken', { session: false }),
  signin
)

// Test
app.get('/api/secret', passportJWT, secret)

app.get(
  '/api/secure',
  // This request must be authenticated using a JWT, or else we will fail
  passport.authenticate(['jwt'], { session: false }),
  (req, res) => {
    res.send('Secure response from ' + JSON.stringify(req.user))
  }
)
app.use('/api', passportJWT)
app.use('/api/user', userRouter)
app.use('/api/restaurant', restaurantRouter)
app.use('/api/review', reviewRouter)
app.use('/api/find', mapsRouter)

export const start = async () => {
  try {
    await connect()
    app.listen(config.port, () => {
      console.log(`Listening on http://localhost:${config.port}/api`)
    })
  } catch (e) {
    console.error(e)
  }
}

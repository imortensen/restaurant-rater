import express from 'express'
import { json, urlencoded } from 'body-parser'
import morgan from 'morgan'
import config from './config'
import cors from 'cors'
import { connect } from './utils/db'
import { signup, signin } from './utils/auth'
import userRouter from './resources/user/user.router'

export const app = express()

// X-Powered-By is a header that tells the browser you are using Express
app.disable('x-powered-by')

app.use(cors())
app.use(json())
app.use(urlencoded({ extended: true }))
app.use(morgan('dev'))

console.log('server test')
app.post('/signup', signup)
app.post('/signin', signin)
app.use('/api/user', userRouter)

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

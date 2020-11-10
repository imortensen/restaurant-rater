import config from '../config'
import { User } from '../resources/user/user.model'
import jwt from 'jsonwebtoken'

// New Token
export const newToken = user => {
  return jwt.sign({ id: user.id }, config.secrets.jwt, {
    expiresIn: config.secrets.jwtExp
  })
}

// Verify Token
export const verifyToken = token =>
  new Promise((resolve, reject) => {
    jwt.verify(token, config.secrets.jwt, (err, payload) => {
      if (err) return reject(err)
      resolve(payload)
    })
  })

// Signup
export const signup = async (req, res) => {
  if (!req.body.email || !req.body.password || !req.body.username) {
    return res
      .status(400)
      .send({ message: 'Email, username, and password required' })
  }
  try {
    const user = await User.create(req.body)
    const token = newToken(user)
    return res.status(201).send({ token })
  } catch (e) {
    console.error(e)
    return res.status(400).end()
  }
}

// Signin
export const signin = async (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res.status(400).send({ message: 'Username and password required' })
  }
  try {
    const user = await User.findOne({ username: req.body.username })
      .select('username password')
      .exec()

    if (!user) {
      return res.status(401).send({ message: 'Username does not exist' })
    }
    const match = await user.checkPassword(req.body.password)
    if (!match) {
      return res.status(401).send({ message: 'Invalid username and password' })
    }

    const token = newToken(user)
    return res.status(201).send({ token })
  } catch (e) {
    console.error(e)
    res.status(401).end()
  }
}

// Protect
export const protect = async (req, res, next) => {
  const bearer = req.headers.authorization

  if (!bearer || !bearer.startsWith('Bearer')) {
    return res.status(401).end()
  }

  const token = bearer.split('Bearer ')[1].trim()
  let payload
  try {
    payload = await verifyToken(token)
  } catch (e) {
    console.log(e)
    return res.status(401).end()
  }

  const user = await User.findById(payload.id)
    .select('-password')
    .lean()
    .exec()

  if (!user) {
    return res.status(401).end()
  }

  req.user = user
  next()
}

import config from '../config'
import jwt from 'jsonwebtoken'
import { User } from '../resources/user/user.model'

// New Token/Sign Token
export const newToken = user => {
  return jwt.sign(
    {
      iss: config.secrets.issuer,
      id: user._id,
      iat: new Date().getTime(),
      exp: new Date().setDate(new Date().getDate() + 1)
    },
    config.secrets.jwt
  )
}

// Signup
export const signup = async (req, res) => {
  if (!req.body.email || !req.body.password || !req.body.username) {
    return res
      .status(400)
      .send({ message: 'Email, username, and password required' })
  }
  try {
    const newUser = {
      authMethod: 'local',
      local: {
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
      }
    }
    console.log('new username: ' + newUser.local.username)
    const user = await User.create(newUser)
    const token = newToken(user)
    return res.status(201).send({ token })
  } catch (e) {
    console.error(e)
    return res.status(400).end()
  }
}

// Signin
export const signin = async (req, res, next) => {
  const token = newToken(req.user)
  res.status(200).json({ token })
}

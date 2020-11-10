import passport from 'passport'
import { ExtractJwt } from 'passport-jwt'
import config from '../config'
import { User } from '../resources/user/user.model'
const JwtStrategy = require('passport-jwt').Strategy
const LocalStrategy = require('passport-local').Strategy
const GoogleTokenStrategy = require('passport-google-token').Strategy

// JWT Strategy
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromHeader('authorization'),
      // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.secrets.jwt
    },
    async (payload, done) => {
      try {
        console.log('jwt strategy')
        const user = await User.findById(payload.id)

        if (!user) {
          return done(null, false)
        }

        done(null, user)
      } catch (err) {
        done(err, false)
      }
    }
  )
)

// Local Strategy
passport.use(
  new LocalStrategy(
    // {
    //   usernameField: 'username'
    // },
    async (username, password, done) => {
      try {
        // Find the user given the username
        const user = await User.findOne({ 'local.username': username })
        if (!user) {
          return done(null, false)
        }

        // Check if the password is correct
        const matches = await user.checkPassword(password)
        if (!matches) {
          return done(null, false)
        }
        done(null, user)
      } catch (err) {
        done(err, false)
      }
    }
  )
)

// Google Oauth Strategy
passport.use(
  'googleToken',
  new GoogleTokenStrategy(
    {
      clientID:
        '859271856157-j82hrobufiarmuti4078elhrechovr8n.apps.googleusercontent.com',
      clientSecret: 'jhMuEX1WOYC1-uBZ3LwEfKXs'
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log('accessToken: ' + accessToken)
        console.log('refresh token: ' + refreshToken)
        console.log('profile id: ' + profile.id)

        // Check whether this current user exists in our database
        const existingUser = await User.findOne({ 'google.id': profile.id })
          .lean()
          .exec()

        console.log('existing user: ' + JSON.stringify(existingUser))
        if (existingUser) {
          return done(null, existingUser)
        }

        const newUser = new User({
          authMethod: 'google',
          google: {
            id: profile.id,
            name: profile.displayName
          }
        })

        await newUser.save()
        done(null, newUser)
      } catch (err) {
        done(err, false, err.message)
      }
    }
  )
)

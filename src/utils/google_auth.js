// src/authentication/google.js
import passport from 'passport'
import passportGoogle from 'passport-google-oauth'
import config from '../config'
import { User } from '../resources/user/user.model'

const passportConfig = {
  clientID: config.googleAuth.clientID,
  clientSecret: config.googleAuth.clientSecret,
  callbackURL: 'http://localhost:3000/api/authentication/google/redirect'
}
console.log('test google authjs')
if (passportConfig.clientID) {
  console.log('yes client id')
  passport.use(
    new passportGoogle.OAuth2Strategy(passportConfig, function(
      request,
      accessToken,
      refreshToken,
      profile,
      done
    ) {
      // See if this user already exists
      // let user = User.getUserByExternalId('google', profile.id)
      console.log('google_auth test')
      let user = User.findOne({
        providers: { provider: 'google', id: profile.id }
      })
      if (!user) {
        // They don't, so register them
        const newUser = {
          username: profile.displayName,
          providers: [{ provider: 'google', id: profile.id }]
        }
        user = User.create(newUser)
      }
      return done(null, user)
    })
  )
}

import passport from 'passport'
import passportJwt from 'passport-jwt'
import config from '../config'
import { User } from '../resources/user/user.model'

const jwtOptions = {
  jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderWithScheme('jwt'),
  secretOrKey: config.secrets.jwt,
  issuer: config.secrets.issuer,
  audience: config.secrets.audience
}

passport.use(
  new passportJwt.Strategy(jwtOptions, (payload, done) => {
    // This function does not exist
    // const user = User.getUserById(parseInt(payload.sub))
    console.log('passport.use, payload.id: ' + payload)
    const user = User.findOne({
      providers: { provider: 'google', id: payload.id }
    })
    if (user) {
      return done(null, user, payload)
    }
    return done()
  })
)

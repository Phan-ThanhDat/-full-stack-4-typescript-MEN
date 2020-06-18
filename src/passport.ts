import passport from 'passport'
import JwtStrategy from 'passport-jwt'
const strategyJWT = JwtStrategy.Strategy
// const JwtStrategy = require('passport-jwt').Strategy
import { ExtractJwt } from 'passport-jwt'
import LocalStrategy from 'passport-local'
const strategyLocal = LocalStrategy.Strategy
import GooglePlusTokenStrategy from 'passport-google-plus-token'
import { Request, Response, NextFunction } from 'express'
import User, { UserType } from './models/User'

const cookieExtractor = (req: Request) => {
  let token: string | null = null
  if (req && req.cookies) {
    token = req.cookies['token']
  }
  console.log(token)
  return token
}

// JSON WEB TOKENS STRATEGY
export const jwtStrategy = passport.use(
  new strategyJWT(
    {
      // jwtFromRequest: cookieExtractor,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
      passReqToCallback: true,
    },
    async (req: Request, payload: any, done) => {
      try {
        console.log('payload=>>> ', req.headers.authorization)
        // console.log('user===>>>>>>', user)
        // Find the user specified in token
        const user = await User.findById(payload.id)
        console.log('payload=>>> ', payload)
        console.log('user===>>>>>>', user)
        // If user doesn't exists, handle it
        if (!user) {
          return done(null, false)
        }

        // Otherwise, return the user
        req.currentUser = user
        done(null, user)
      } catch (error) {
        done(error, false)
      }
    }
  )
)

// LOCAL STRATEGY
passport.use(
  new strategyLocal(
    {
      usernameField: 'email',
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        console.log(email, password)
        // Find the user given the email
        const user = await User.findOne({ email }).select('+password')

        // If not, handle it
        if (!user) {
          return done(null, false)
        }

        console.log('password--> ', password)
        // Check if the password is correct
        const isMatch = await user.matchPassword(password)

        // If not, handle it
        if (!isMatch) {
          return done(null, false)
        }

        // Otherwise, return the user
        req.currentUser = user
        done(null, user)
      } catch (error) {
        done(error, false)
      }
    }
  )
)

// Google OAuth Strategy
passport.use(
  'googleToken',
  new GooglePlusTokenStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      passReqToCallback: true,
    },
    async (
      req: Request,
      accessToken: string,
      refreshToken: string,
      profile: any,
      done
    ) => {
      try {
        // console.log('profile', profile)
        // console.log('accessToken', accessToken)
        // console.log('refreshToken', refreshToken)

        const existingUser = await User.findOne({
          googleId: profile.id,
          email: profile.emails[0]['value'],
        })

        if (!existingUser) {
          console.log(1111)
          req.currentUser = new User({
            googleId: profile.id,
            email: profile.emails[0]['value'],
            role: 'user',
          })
          await req.currentUser.save()
          return done(null, req.currentUser)
        } else {
          req.currentUser = existingUser
          return done(null, req.currentUser)
        }
      } catch (error) {
        done(error, false, error.message)
      }
    }
  )
)

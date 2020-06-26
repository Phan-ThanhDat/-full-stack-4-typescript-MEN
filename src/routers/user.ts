import express from 'express'
require('../passport')
import passport from 'passport'

const passportLocal = passport.authenticate('local', { session: false })

const router = express.Router()

import { register, login, logout } from '../controllers/user'
import validatePassword, { schemas } from '../middlewares/validate'

router.post('/register', register)
router.post(
  '/login',
  validatePassword(schemas.validatePassword),
  passportLocal,
  login
)
router.post(
  '/oauth/google',
  passport.authenticate('googleToken', { session: false }),
  login
)
router.get('/logout', logout)
export default router

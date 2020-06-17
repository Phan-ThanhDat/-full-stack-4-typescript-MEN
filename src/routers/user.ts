import express from 'express'
require('../passport')
import passport from 'passport'
const passportLocal = passport.authenticate('local', { session: false })

const router = express.Router()

import { register, login, logout } from '../controllers/user'

router.post('/register', register)
router.post('/login', passportLocal, login)
router.get('/logout', logout)
export default router

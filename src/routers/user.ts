import express from 'express'

const router = express.Router()

import { register } from '../controllers/user'

router.post('/register', register)

export default router

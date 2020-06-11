import express from 'express'

const router = express.Router()

import { findAll } from '../controllers/product'

router.route('/').get(findAll)

export default router

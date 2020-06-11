import express from 'express'

const router = express.Router()

import { findAll, createMovie } from '../controllers/product'

router.route('/').get(findAll).post(createMovie)

export default router

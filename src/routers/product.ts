import express from 'express'

const router = express.Router()
import { protect, checkRole } from '../middlewares/auth'
// eslint-disable-next-line @typescript-eslint/
require('../passport')

import passport from 'passport'

import {
  findAll,
  createProduct,
  findProductById,
  findProductByQuery,
  updateProductById,
  deleteProductById,
  deleteAll,
} from '../controllers/product'

const passportJWT = passport.authenticate('jwt', { session: false })

router.get('/filter', findProductByQuery)

router
  .route('/:id')
  .get(findProductById)
  .patch(updateProductById)
  .delete(deleteProductById)

router
  .route('/')
  .get(findAll)
  // .post(passportJWT, [protect, checkRole(['admin'])], createProduct)
  .post(passportJWT, checkRole(['admin']), createProduct)
  .delete(deleteAll)

export default router

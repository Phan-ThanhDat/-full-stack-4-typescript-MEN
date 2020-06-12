import express from 'express'

const router = express.Router()
import { protect, checkRole } from '../middlewares/auth'

import {
  findAll,
  createProduct,
  findProductById,
  findProductByQuery,
  updateProductById,
  deleteProductById,
  deleteAll,
} from '../controllers/product'

router.get('/filter', findProductByQuery)

router
  .route('/:id')
  .get(findProductById)
  .patch(updateProductById)
  .delete(deleteProductById)

const rolesPostProduct: string[] = ['admin', 'user']
router
  .route('/')
  .get(findAll)
  .post([protect, checkRole(['admin'])], createProduct)
  .delete(deleteAll)

export default router

import express from 'express'

const router = express.Router()

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

router.route('/').get(findAll).post(createProduct).delete(deleteAll)

export default router

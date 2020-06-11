import express from 'express'

const router = express.Router()

import {
  findAll,
  createProduct,
  findProductById,
  updateProductById,
  deleteProductById,
  deleteAll,
} from '../controllers/product'

router
  .route('/:id')
  .get(findProductById)
  .patch(updateProductById)
  .delete(deleteProductById)
router.route('/').get(findAll).post(createProduct).delete(deleteAll)

export default router

import Product, { ProductType } from '../models/Product'

function findAll(): Promise<ProductType[]> {
  return Product.find().sort({ name: 1 }).exec() // Return a Promise
}

export default {
  findAll,
}

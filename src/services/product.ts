import Product, { ProductType } from '../models/Product'

function findAll(): Promise<ProductType[]> {
  return Product.find().sort({ name: 1 }).exec() // Return a Promise
}

function create(product: ProductType): Promise<ProductType> {
  return product.save()
}

export default {
  findAll,
  create,
}

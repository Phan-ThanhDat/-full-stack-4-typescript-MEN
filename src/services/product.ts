import Product, { ProductType } from '../models/Product'
import { Request, Response, NextFunction } from 'express'

function findAll(req?: Request): Promise<ProductType[]> {
  const page = req?.query.page || 1
  const limit = req?.query.limit || 10
  const pageOptions = {
    page: page as number,
    limit: limit as number,
  }
  const skip = pageOptions.page * pageOptions.limit

  return (
    Product.find()
      // .skip(skip)
      // .limit(pageOptions.limit)
      // .sort({ name: 1 })
      .exec()
    // .then(product => {
    //   if (!product) {
    //     throw new Error('Product not found')
    //   }
    //   return product
    // })
  ) // Return a Promise
}

function findProductByQueryParams(query): Promise<ProductType[]> {
  const page = query.page || 1
  const limit = query.limit || 10
  const pageOptions = {
    page: (page as number) || 0,
    limit: limit as number,
  }
  console.log('req.query =>>>>', query)

  return (
    Product.find(query)
      // .skip(pageOptions.page * pageOptions.limit)
      // .limit(pageOptions.limit)
      .exec()
  )
}

function findProductById(id: string): Promise<ProductType | null> {
  return Product.findById(id).exec()
}

async function create(product: ProductType): Promise<ProductType> {
  return product.save()
}

async function updateProductById(req: Request): Promise<ProductType | null> {
  return Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
}

async function deleteProductById(req: Request): Promise<ProductType | null> {
  return Product.findByIdAndDelete(req.params.id)
}

async function deleteAllProducs(): Promise<ProductType | null> {
  return Product.collection.drop()
}

export default {
  findAll,
  findProductById,
  findProductByQueryParams,
  create,
  updateProductById,
  deleteProductById,
  deleteAllProducs,
}

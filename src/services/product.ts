import Product, { ProductType } from '../models/Product'
import { Request, Response, NextFunction } from 'express'

function findAll(req: Request): Promise<ProductType[]> {
  const page = req.query.page || 1
  const limit = req.query.limit || 10
  const pageOptions = {
    page: (page as number) || 0,
    limit: limit as number,
  }
  return Product.find()
    .skip(pageOptions.page * pageOptions.limit)
    .limit(pageOptions.limit)
    .sort({ name: 1 })
    .exec() // Return a Promise
}

function findProductByQueryParams(req: Request): Promise<ProductType[]> {
  const page = req.query.page || 1
  const limit = req.query.limit || 10
  const pageOptions = {
    page: (page as number) || 0,
    limit: limit as number,
  }
  return Product.find(req.query)
    .skip(pageOptions.page * pageOptions.limit)
    .limit(pageOptions.limit)
    .exec()
}

function findProductById(id: string): Promise<ProductType | null> {
  return Product.findById(id).exec()
}

function create(product: ProductType): Promise<ProductType> {
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

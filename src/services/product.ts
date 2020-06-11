import Product, { ProductType } from '../models/Product'
import { Request, Response, NextFunction } from 'express'

function findAll(): Promise<ProductType[]> {
  return Product.find().sort({ name: 1 }).exec() // Return a Promise
}

function create(product: ProductType): Promise<ProductType> {
  return product.save()
}

function findProductById(id: string): Promise<ProductType | null> {
  return Product.findById(id).exec()
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
  create,
  findProductById,
  updateProductById,
  deleteProductById,
  deleteAllProducs,
}

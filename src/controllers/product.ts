import { Request, Response, NextFunction } from 'express'

import Product from '../models/Product'
import ProductService from '../services/product'
import {
  NotFoundError,
  BadRequestError,
  InternalServerError,
} from '../helpers/apiError'

// GET /products
export const findAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.status(200).json(await ProductService.findAll())
  } catch (error) {
    next(new NotFoundError('Product not found', error))
  }
}

// GET /products/:id
export const findProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res
      .status(200)
      .json(await ProductService.findProductById(req.params.id as string))
  } catch (error) {
    next(new NotFoundError('Product not found', error))
  }
}

// PATCH /products/:id
export const updateProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await ProductService.updateProductById(req)

    if (!product) {
      return res.status(400).json({
        success: false,
        error: 'do not have bootcamp which has same id',
      })
    }

    console.log(product)
    res.status(200).json({
      success: true,
      data: product,
    })
  } catch (error) {
    next(new NotFoundError('Product not found', error))
  }
}

// POST /products
export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      name,
      description,
      categories,
      variants,
      sizes,
      isVariable,
    } = req.body

    const product = new Product({
      name,
      description,
      categories,
      variants,
      sizes,
      isVariable,
    })

    await ProductService.create(product)
    res.status(201).json(product)
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(new InternalServerError('Internal Server Error', error))
    }
  }
}

// Delete /products/:id
export const deleteProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await ProductService.deleteProductById(req)
    console.log(product)
    if (!product) {
      return res.status(400).json({
        success: false,
        error: 'do not have product which has same id',
      })
    }
    res.status(200).json({
      success: true,
      data: {},
    })
  } catch (error) {
    next(new NotFoundError('Product not found', error))
  }
}

// GET /products
export const deleteAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.status(200).json(await ProductService.deleteAllProducs())
  } catch (error) {
    next(new NotFoundError('Product not found', error))
  }
}

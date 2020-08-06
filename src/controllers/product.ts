import { Request, Response, NextFunction } from 'express'

import Product from '../models/Product'
import ProductService from '../services/product'
import {
  NotFoundError,
  BadRequestError,
  InternalServerError,
} from '../helpers/apiError'
import User, { UserType } from '../models/User'

async function checkAccountBeforeCRUD(
  id: string,
  next: NextFunction
): Promise<any> {
  const currentId = id
  const user: UserType | null = await User.findById(currentId).select(
    '+password'
  )
  // Only admin account can post more than one bootcamp
  if (user && user.role !== 'admin') {
    return next(
      new BadRequestError(
        'This user account is not allowed to create new product',
        new Error()
      )
    )
  }

  if (!user) {
    return next(
      new BadRequestError('Please login before create new product', new Error())
    )
  }
  return user
}

// GET /products
export const findAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await ProductService.findAll(req)
    if (!products || products.length === 0) {
      return next(new NotFoundError('Product not found', new Error()))
    }

    res.status(200).json({
      success: true,
      data: products,
    })
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

// GET /products/filter
export const findProductByQuery = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.status(200).json(await ProductService.findProductByQueryParams(req))
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
    if (req.currentUser) {
      const user: UserType = await checkAccountBeforeCRUD(
        req.currentUser.id,
        next
      )

      const product = await ProductService.updateProductById(req)

      if (!product) {
        return next(new NotFoundError('Product not found', new Error()))
      }

      res.status(200).json({
        success: true,
        data: product,
      })
    } else {
      return next(new BadRequestError('Please check your account', new Error()))
    }
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

    if (req.currentUser) {
      const user: UserType = await checkAccountBeforeCRUD(
        req.currentUser.id,
        next
      )
      const product = new Product({
        name,
        description,
        categories,
        variants,
        sizes,
        isVariable,
        user: req.currentUser.id,
      })
      // Create product
      await ProductService.create(product)
      // Push and save new product to current user
      console.log(user.products)
      user.products.push(product._id)
      console.log(user.products)
      // const a = await User.findByIdAndUpdate(
      //   user.id,
      //   {
      //     produts: user.products,
      //   },
      //   {
      //     new: true,
      //     runValidators: true,
      //   }
      // )
      user.save()
      res.status(201).json(product)
    } else {
      return next(new BadRequestError('Please check your account', new Error()))
    }
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

// DELETE /products
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

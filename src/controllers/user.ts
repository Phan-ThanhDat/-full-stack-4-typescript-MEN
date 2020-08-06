import { Request, Response, NextFunction } from 'express'

import User, { UserType } from '../models/User'
import UserService from '../services/user'
import {
  NotFoundError,
  BadRequestError,
  InternalServerError,
} from '../helpers/apiError'

// Get token from model , create cookie and send response
const sendTokenResponse = (
  user: UserType,
  statusCode: number,
  res: Response
) => {
  // Create token
  const token = user.getSignedJwtToken()

  const JWT_COOKIE_EXPIRE =
    ((process.env['JWT_COOKIE_EXPIRE'] as unknown) as number) || 0
  const options = {
    expires: new Date(Date.now() + JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: false,
  }

  if (process.env.NODE_ENV === 'production') {
    options.secure = true
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .set('Authorization', `Bearer ${token}`)
    .json({
      success: true,
      token,
    })
}

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const newUSer = new User(req.body)
    // Create user
    const user: UserType = await UserService.createNewUser(newUSer)
    sendTokenResponse(user, 201, res)
  } catch (error) {
    next(new NotFoundError(error.message, error))
  }
}

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 100),
    })
    res.status(200).json({
      success: true,
      message: 'Logout succesfully',
    })
  } catch (error) {
    next(new NotFoundError(error.message, error))
  }
}

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // console.log('req.currentUser', req.currentUser)
    // const user: UserType = await UserService.loginUser(req, next)
    sendTokenResponse(req.currentUser, 200, res)
  } catch (error) {
    next(new NotFoundError(error.message, error))
  }
}

// export const loginWithGG = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   console.log(req.currentUser)
//   sendTokenResponse(req.currentUser, 200, res)
// }

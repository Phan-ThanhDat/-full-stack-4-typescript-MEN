import ErrorResponse from '../util/errorResponse'
import jwt from 'jsonwebtoken'
import User, { UserType } from '../models/User'
// const User = require('../models/User')
import { Request, Response, NextFunction } from 'express'

// Protect routes
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]
  }

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse('Not authorize to access this route', 401))
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env['JWT_SECRET'] as string)

    // Extend res objects to next middlewares
    res.locals.userInfo = decoded

    next()
  } catch (err) {
    return next(new ErrorResponse(err.message, 401))
  }
}

// Grant access to specific roles
export const checkRole = (roles: Array<string>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const currentUser = await User.findById(res.locals.userInfo.id)
    if (currentUser && !roles.includes(currentUser.role)) {
      return next(
        new ErrorResponse(
          `User role ${currentUser.role} of ${currentUser.email} can not access`,
          401
        )
      )
    }
    next()
  }
}

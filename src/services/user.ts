import { UserSchema } from '../models/User'
import jwt from 'jsonwebtoken'
import User, { UserType } from '../models/User'
import { Request, Response, NextFunction } from 'express'
import ErrorResponse from '../util/errorResponse'

function createNewUser(newUser: UserType): Promise<UserType> {
  return newUser.save()
}

// function createNewUserOathGG(payload: UserType): Promise<UserType> {
//   const user = new User(payload)
//   return user.save()
// }

async function loginUser(req: Request, next: NextFunction): Promise<any> {
  const { email, password } = req.body

  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400))
  }

  const user = await User.findOne({ email }).select('+password')

  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401))
  }

  const isMatch = await user.matchPassword(password)

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401))
  }

  return user
}

export default {
  createNewUser,
  loginUser,
  // createNewUserOathGG,
}

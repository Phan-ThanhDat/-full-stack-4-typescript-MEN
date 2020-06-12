import { UserSchema } from '../models/User'
import jwt from 'jsonwebtoken'
import User, { UserType } from '../models/User'
import { Request, Response } from 'express'

function createNewUser(req: Request): Promise<UserType> {
  const user = new User(req.body)
  return user.save()
}

export default {
  createNewUser,
}

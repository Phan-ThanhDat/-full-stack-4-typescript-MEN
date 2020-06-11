import mongoose, { Document } from 'mongoose'
import { Request, Response, NextFunction } from 'express'

export interface User extends mongoose.Document {
  name: string;
  email: string;
  role: string;
  password: string;
  resetPasswordToken: string;
  resetPasswordExpire: Date;
  createdAt: Date;
  products: mongoose.Types.ObjectId[];
}

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    unique: true,
  },
  email: {
    type: String,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'admin',
  },
  password: {
    type: String,
    required: [true, 'Please input valid password'],
    minlength: 10,
    select: false,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  products: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Product',
    },
  ],
})

module.exports = mongoose.model<User>('User', UserSchema)

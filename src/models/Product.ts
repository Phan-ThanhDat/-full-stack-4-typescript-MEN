import mongoose, { Document } from 'mongoose'
import { Request, Response, NextFunction } from 'express'

export interface ProductType extends mongoose.Document {
  name: string;
  description: string;
  categories: string;
  variants: string[];
  sizes: string;
  user: mongoose.Types.ObjectId;
  isVariable: boolean;
}

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    unique: true,
  },
  description: {
    type: String,
  },
  categories: {
    type: String,
    enum: ['machine', 'fashion', 'funiture', 'food'],
    default: 'food',
  },
  variants: [
    {
      type: String,
    },
  ],
  sizes: String,
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  },
  isVariable: {
    type: Boolean,
    default: true,
  },
})

export default mongoose.model<ProductType>('Product', ProductSchema)

import mongoose, { Document } from 'mongoose'
import { Request, Response, NextFunction } from 'express'

export interface Product extends mongoose.Document {
  name: string;
  description: string;
  categories: string[];
  variants: string[];
  sizes: string[];
  user: mongoose.Types.ObjectId;
  isVariable: boolean;
}

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
  },
  description: {
    type: String,
  },
  categories: {
    type: String,
  },
  variants: [
    {
      type: String,
    },
  ],
  sizes: [String],
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isVariable: {
    type: Boolean,
    default: true,
  },
})

module.exports = mongoose.model<Product>('User', ProductSchema)

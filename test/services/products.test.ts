import Product, { ProductType } from '../../src/models/Product'
import ProductService from '../../src/services/product'
import * as dbHelper from '../db-helper'
import sinon from 'sinon'
import {findAll} from '../../src/controllers/product'
import * as sinongMongoose from 'sinon-mongoose'
import { DocumentQuery } from 'mongoose'
import request from 'supertest'

import { Request, Response, NextFunction } from 'express'

// class Response {
//   status(status) {
//     this.status = status
//     return this
//   }
//   json(data) {
//     return data
//   }
// }

// class Request {}

async function addProduct() {
  const product = new Product({
    name: 'MacBook air check1ww',
    description: 'Laptop',
    categories: 'machine',
    variants: ['white', 'silver'],
    sizes: '14.4 inches',
    isVariable: true,
  })

  // return await ProductService.add
}

describe('movie service', () => {
  beforeEach(async () => {
    await dbHelper.connect()
  })

  afterEach(async () => {
    await dbHelper.clearDatabase()
  })

  afterAll(async () => {
    await dbHelper.closeDatabase()
  })

  it.only('should return 200 if findAll succeeds', async () => {
      // stub -> ProductService.findAll(req)
  })
})

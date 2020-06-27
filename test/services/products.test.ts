import Product, { ProductType } from '../../src/models/Product'
import ProductService from '../../src/services/product'
import * as dbHelper from '../db-helper'
import sinon from 'sinon'
import {findAll} from '../../src/controllers/product'
import * as sinongMongoose from 'sinon-mongoose'
import { DocumentQuery } from 'mongoose'
import request from 'supertest'

import { Request, Response, NextFunction } from 'express'

const nonExistingProductId = 'NanaChoHeo123456789'

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

let req = {
      query: {
        categories: 'machine',
      },
      params: {
        id: '5aa06bb80738152cfd536fdc',
        driverId: '5aa13452e1e2c3277688e734'
      }
    }

async function addNewProduct(override?) {
  let product = {
    name: 'MacBook air check1ww',
    description: 'Laptop',
    categories: 'machine',
    variants: ['white', 'silver'],
    sizes: '14.4 inches',
    isVariable: true,
  }

  if (override) {
    product = {...product, ...override}
  }
  const newProduct = new Product(product)
  return await ProductService.create(newProduct)
}

describe('product service', () => {
  beforeEach(async () => {
    await dbHelper.connect()
  })

  afterEach(async () => {
    await dbHelper.clearDatabase()
  })

  afterAll(async () => {
    await dbHelper.closeDatabase()
  })

  it('should return list products when findAll succeeds', async () => {
      // stub -> ProductService.findAll(req)
    const addNewProductRes = await addNewProduct()
    const findAllProducts = await ProductService.findAll()
    console.log(findAllProducts)
    expect(findAllProducts[0]['_doc']).toHaveProperty('_id')
    expect(findAllProducts[0]['_doc']!.name).toEqual('MacBook air check1ww')
    expect(findAllProducts[0]['_doc']!.description).toEqual('Laptop')
    expect(findAllProducts[0]['_doc']!.categories).toEqual('machine')
    expect(findAllProducts[0]['_doc']!.sizes).toEqual('14.4 inches')
    expect(findAllProducts[0]['_doc']!.isVariable).toEqual(true)
  })

  it('should get product list when query params is valid', async () => {
    // expect.assertions(1)
    const addNewProductRes = await addNewProduct()
    const listProduct = await ProductService.findProductByQueryParams(req.query)
    expect(listProduct.length).toEqual(1)
    expect(listProduct[0]['_doc'].name).toEqual('MacBook air check1ww')
    expect(listProduct[0]['_doc'].categories).toEqual('machine')
    expect(listProduct[0]['_doc']).toHaveProperty('_id')
  })
})

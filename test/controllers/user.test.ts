import Product, { ProductType } from '../../src/models/Product'
import ProductService from '../../src/services/product'
import * as dbHelper from '../db-helper'
import sinon from 'sinon'

import request from 'supertest'

import * as sinongMongoose from 'sinon-mongoose'
import { DocumentQuery } from 'mongoose'
import { findAll } from '../../src/controllers/product'
import app from '../../src/app'
import User, {UserType} from '../../src/models/User'
import bcrypt from 'bcryptjs'

class Response {
  status(status) {
    this.status = status
    return this
  }
  json(data) {
    return data
  }
}

class Request {}

const testUser = {
  name: 'test',
  email: 'abc@abc.com',
  password: '123abc',
}
// let req = {
//       body: {
//         manufacturer: "Toyota",
//         name: "Camry",
//         model: "2018",
//       },
//       params: {
//         id: "5aa06bb80738152cfd536fdc",
//         driverId: "5aa13452e1e2c3277688e734"
//       }
//     },

async function addNewProduct() {
  const product = new Product({
    name: 'MacBook air check1ww',
    description: 'Laptop',
    categories: 'machine',
    variants: ['white', 'silver'],
    sizes: '14.4 inches',
    isVariable: true,
  })

  return await ProductService.create(product)
}

async function createUser(override?: Partial<UserType>) {
  let user = { ...testUser }

  if (override) {
    user = { ...user, ...override }
  }

  return await request(app).post('/api/v1/users/register').send(user)
}

async function login(username?: string, password?: string) {
  return request(app)
    .post('/api/v1/users/login')
    .send({
      username: username ? username : testUser.name,
      password: password ? password : testUser.password,
    })
}

const listProduct = [
  {
    name: 'MacBook air 1',
    description: 'Laptop',
    categories: 'machine',
    variants: ['white', 'silver'],
    sizes: '14.4 inches',
    isVariable: true,
  },
  {
    name: 'MacBook mac 2',
    description: 'desktop',
    categories: 'machine',
    variants: ['black', 'silver'],
    sizes: '15.4 inches',
    isVariable: true,
  },
]
const adminAccount = {
  email: 'phduc.phanhongduc@gmail.com',
  password: '012345678910',
}
describe('product controller', () => {
  beforeEach(async () => {
    await dbHelper.connect()
    await Product.insertMany([...listProduct])

    const salt = await bcrypt.genSalt(10)
    const passwordEncrypted = await bcrypt.hash(adminAccount.password, salt)
    await User.insertMany([
      {
        email: adminAccount.email,
        password: passwordEncrypted,
      },
    ])
  })

  afterEach(async () => {
    await dbHelper.clearDatabase()
  })

  afterAll(async () => {
    await dbHelper.closeDatabase()
  })

  it('should return right data when login succeeds', async () => {
    // Login
    const currentUserRes = await request(app)
      .post('/api/v1/users/login')
      .send(adminAccount)

    expect(currentUserRes.status).toBe(200)
    expect(currentUserRes.header).toHaveProperty('authorization')
    const authorizationContent: string[] = currentUserRes.header[
      'authorization'
      ].split(' ')
    expect(authorizationContent.length).toBe(2)
    expect(authorizationContent[0]).toEqual('Bearer')
    expect(authorizationContent[1]).toEqual(currentUserRes.body?.token)
    expect(currentUserRes.body?.success).toBeTruthy()
    expect(authorizationContent[1])
      .toEqual(currentUserRes.header['set-cookie'][0].split('=')[1].split(';')[0])
  })
})

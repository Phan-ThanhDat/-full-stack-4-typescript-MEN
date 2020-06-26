import Product, { ProductType } from '../../src/models/Product'
import ProductService from '../../src/services/product'
import * as dbHelper from '../db-helper'
import sinon from 'sinon'

import request from 'supertest'

import * as sinongMongoose from 'sinon-mongoose'
import { DocumentQuery } from 'mongoose'
import {findAll} from '../../src/controllers/product'
import app from '../../src/app'
import User from '../../src/models/User';
import bcrypt from 'bcryptjs';

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
    }
]
const adminAccount = {
    email: 'phduc.phanhongduc@gmail.com',
    password: '012345678910'
}
describe('product controller', () => {
    beforeEach(async () => {
        await dbHelper.connect()
        await Product.insertMany([...listProduct])

        const salt = await bcrypt.genSalt(10)
        const passwordEncrypted = await bcrypt.hash(adminAccount.password, salt)
        await User.insertMany([{
            email: adminAccount.email,
            password: passwordEncrypted
        }])
    })

    afterEach(async () => {
        await dbHelper.clearDatabase()
    })

    afterAll(async () => {
        await dbHelper.closeDatabase()
    })

    it('should return right list products when ProductService.findAll is called', async () => {
        await dbHelper.clearDatabase()

        // stub ProductService.findAll()
        const allProducts = sinon.stub(ProductService, 'findAll').returns([
            ...listProduct
        ] as any)

        // simulate next function cb by mock function
        const next = jest.fn()

        const req = {} as any
        const res = {} as any

        // call Controllers.findAll()
        await findAll(req, res, next)
        expect(await ProductService.findAll()).toEqual(listProduct)
    })

    it('should return 200 when getting all list succeeds', async () => {
        const res = await request(app)
            .get('/api/v1/products')
        console.log('....res...', res)
        expect(res.status).toEqual(200)
        expect(res.body.data[0].name).toEqual(listProduct[0].name)
        expect(res.body.data[1].name).toEqual(listProduct[1].name)
    })

    it('should return not 200 when getting all list is empty', async () => {
        await dbHelper.clearDatabase()

        const res = await request(app)
            .get('/api/v1/products')

        const is200StatusCode = res.body?.statusCode === 200
        expect(is200StatusCode).toBeFalsy()
    })

    it('should return 200 when creating new product succeeds', async () => {
        // Login
        const currentUserRes = await request(app)
            .post('/api/v1/users/login')
            .send(adminAccount)

        // Create new product
        const res = await request(app)
            .post('/api/v1/products')
            .send({
                name: 'MacBook pro 2018',
                description: 'Laptop',
                categories: 'machine',
                variants: ['black', 'white', 'silver'],
                sizes: '12.6 inches',
                isVariable: true,
            })
            .set('Authorization', `Bearer ${currentUserRes?.body?.token}`)
        const is200StatusCode = res.status == 201

        expect(res.body.name).toEqual('MacBook pro 2018')
        expect(is200StatusCode).toBeTruthy()
    })
})

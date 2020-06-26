import User, { UserType } from '../../src/models/User'
import ProductService from '../../src/services/product'
import * as dbHelper from '../db-helper'
import sinon from 'sinon'
import {findAll} from '../../src/controllers/product'
import * as sinongMongoose from 'sinon-mongoose'
import { DocumentQuery } from 'mongoose'
import request from 'supertest'

import { Request, Response, NextFunction } from 'express'
import app from '../../src/app'
import bcrypt from 'bcryptjs'
import UserService from '../../src/services/user'

const adminAccount = {
  email: 'phduc.phanhongduc@gmail.com',
  password: '012345678910',
}

async function addNewUser() {
  const newUser: UserType = new User(adminAccount)

  return await UserService.createNewUser(newUser)
}

describe('user service', () => {
  beforeEach(async () => {
    await dbHelper.connect()

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

  it('should return the user when email and password is matched in db', async () => {
    const {email, password} = adminAccount
    const userDB = await User.findOne({ email }).select('+password')
    const isMatch = await userDB!.matchPassword(password) || false

    expect(isMatch).toBeTruthy()
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(userDB['_doc'].email).toEqual(adminAccount.email)
  })

  it('should saving succeeds the user', async () => {
    await dbHelper.clearDatabase()

    const newUserDB = await addNewUser()

    const isMatch = await newUserDB!.matchPassword(adminAccount.password) || false
    expect(isMatch).toBeTruthy()
    expect(newUserDB.email).toEqual(adminAccount.email)
  })
})

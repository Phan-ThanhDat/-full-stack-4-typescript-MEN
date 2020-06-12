import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

export interface UserType extends mongoose.Document {
  name: string;
  email: string;
  role: string;
  password: string;
  resetPasswordToken: string;
  resetPasswordExpire: Date;
  createdAt: Date;
  products: mongoose.Types.ObjectId[];
  getSignedJwtToken(): jwt.Secret | any;
  matchPassword(password: string): boolean;
}

export const UserSchema = new mongoose.Schema({
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
    unique: true,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'admin',
  },
  password: {
    type: String,
    required: [true, 'Please input valid password'],
    minlength: [10, 'The length of password is 10 charactor'],
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

UserSchema.pre<UserType>('save', async function (next) {
  if (!this.isModified('password')) {
    console.log('inside')
    next()
  }
  console.log('outside')
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign(
    {
      id: this._id,
    },
    process.env['JWT_SECRET'] as string,
    {
      expiresIn: process.env.JWT_EXPIRE,
    }
  )
}

// Match user entered password to hashed password in db
UserSchema.methods.matchPassword = async function (enteredPassword: string) {
  return bcrypt.compare(enteredPassword, this.password)
}

export default mongoose.model<UserType>('User', UserSchema)

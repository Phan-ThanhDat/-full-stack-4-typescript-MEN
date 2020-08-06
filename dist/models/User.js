"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
exports.UserSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
    },
    googleId: {
        type: String,
        unique: true,
    },
    email: {
        trim: true,
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
        trim: true,
        type: String,
        // required: [true, 'Please input valid password'],
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
            type: mongoose_1.default.Types.ObjectId,
            ref: 'Product',
        },
    ],
});
exports.UserSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified('password')) {
            next();
        }
        console.log(222);
        const salt = yield bcryptjs_1.default.genSalt(10);
        this.password = yield bcryptjs_1.default.hash(this.password, salt);
    });
});
exports.UserSchema.methods.getSignedJwtToken = function () {
    return jsonwebtoken_1.default.sign({
        id: this._id,
    }, process.env['JWT_SECRET'], {
        expiresIn: process.env.JWT_EXPIRE,
    });
};
// Match user entered password to hashed password in db
exports.UserSchema.methods.matchPassword = function (enteredPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return bcryptjs_1.default.compare(enteredPassword, this.password);
    });
};
exports.default = mongoose_1.default.model('User', exports.UserSchema);
//# sourceMappingURL=User.js.map
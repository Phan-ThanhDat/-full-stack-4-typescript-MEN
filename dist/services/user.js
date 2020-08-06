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
const User_1 = __importDefault(require("../models/User"));
const errorResponse_1 = __importDefault(require("../util/errorResponse"));
function createNewUser(newUser) {
    return newUser.save();
}
// function createNewUserOathGG(payload: UserType): Promise<UserType> {
//   const user = new User(payload)
//   return user.save()
// }
function loginUser(req, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new errorResponse_1.default('Please provide an email and password', 400));
        }
        const user = yield User_1.default.findOne({ email }).select('+password');
        if (!user) {
            return next(new errorResponse_1.default('Invalid credentials', 401));
        }
        const isMatch = yield user.matchPassword(password);
        if (!isMatch) {
            return next(new errorResponse_1.default('Invalid credentials', 401));
        }
        return user;
    });
}
exports.default = {
    createNewUser,
    loginUser,
};
//# sourceMappingURL=user.js.map
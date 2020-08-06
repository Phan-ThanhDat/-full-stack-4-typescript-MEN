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
exports.login = exports.logout = exports.register = void 0;
const User_1 = __importDefault(require("../models/User"));
const user_1 = __importDefault(require("../services/user"));
const apiError_1 = require("../helpers/apiError");
// Get token from model , create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();
    const JWT_COOKIE_EXPIRE = process.env['JWT_COOKIE_EXPIRE'] || 0;
    const options = {
        expires: new Date(Date.now() + JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: false,
    };
    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }
    res
        .status(statusCode)
        .cookie('token', token, options)
        .set('Authorization', `Bearer ${token}`)
        .json({
        success: true,
        token,
    });
};
exports.register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newUSer = new User_1.default(req.body);
        // Create user
        const user = yield user_1.default.createNewUser(newUSer);
        sendTokenResponse(user, 201, res);
    }
    catch (error) {
        next(new apiError_1.NotFoundError(error.message, error));
    }
});
exports.logout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.cookie('token', 'none', {
            expires: new Date(Date.now() + 100),
        });
        res.status(200).json({
            success: true,
            message: 'Logout succesfully',
        });
    }
    catch (error) {
        next(new apiError_1.NotFoundError(error.message, error));
    }
});
exports.login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log('req.currentUser', req.currentUser)
        // const user: UserType = await UserService.loginUser(req, next)
        sendTokenResponse(req.currentUser, 200, res);
    }
    catch (error) {
        next(new apiError_1.NotFoundError(error.message, error));
    }
});
// export const loginWithGG = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   console.log(req.currentUser)
//   sendTokenResponse(req.currentUser, 200, res)
// }
//# sourceMappingURL=user.js.map
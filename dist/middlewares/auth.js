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
exports.checkRole = exports.protect = void 0;
const errorResponse_1 = __importDefault(require("../util/errorResponse"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Protect routes
exports.protect = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    else if (req.cookies.token) {
        token = req.cookies.token;
    }
    // Make sure token exists
    if (!token) {
        return next(new errorResponse_1.default('Not authorize to access this route', 401));
    }
    try {
        // Verify token
        const decodedJWT = jsonwebtoken_1.default.verify(token, process.env['JWT_SECRET']);
        req.currentUser = decodedJWT;
        next();
        // Extend res objects to next middlewares
    }
    catch (err) {
        return next(new errorResponse_1.default(err.message, 401));
    }
});
// Grant access to specific roles
exports.checkRole = (roles) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        if (!roles.includes(req.currentUser.role)) {
            return next(new errorResponse_1.default(`User role ${req.currentUser.role} of ${req.currentUser.email} can not access`, 401));
        }
        next();
    });
};
//# sourceMappingURL=auth.js.map
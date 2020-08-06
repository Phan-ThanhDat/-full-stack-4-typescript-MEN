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
exports.deleteAll = exports.deleteProductById = exports.createProduct = exports.updateProductById = exports.findProductByQuery = exports.findProductById = exports.findAll = void 0;
const Product_1 = __importDefault(require("../models/Product"));
const product_1 = __importDefault(require("../services/product"));
const apiError_1 = require("../helpers/apiError");
const User_1 = __importDefault(require("../models/User"));
function checkAccountBeforeCRUD(id, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const currentId = id;
        const user = yield User_1.default.findById(currentId).select('+password');
        // Only admin account can post more than one bootcamp
        if (user && user.role !== 'admin') {
            return next(new apiError_1.BadRequestError('This user account is not allowed to create new product', new Error()));
        }
        if (!user) {
            return next(new apiError_1.BadRequestError('Please login before create new product', new Error()));
        }
        return user;
    });
}
// GET /products
exports.findAll = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield product_1.default.findAll(req);
        if (!products || products.length === 0) {
            return next(new apiError_1.NotFoundError('Product not found', new Error()));
        }
        res.status(200).json({
            success: true,
            data: products,
        });
    }
    catch (error) {
        next(new apiError_1.NotFoundError('Product not found', error));
    }
});
// GET /products/:id
exports.findProductById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res
            .status(200)
            .json(yield product_1.default.findProductById(req.params.id));
    }
    catch (error) {
        next(new apiError_1.NotFoundError('Product not found', error));
    }
});
// GET /products/filter
exports.findProductByQuery = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).json(yield product_1.default.findProductByQueryParams(req));
    }
    catch (error) {
        next(new apiError_1.NotFoundError('Product not found', error));
    }
});
// PATCH /products/:id
exports.updateProductById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.currentUser) {
            const user = yield checkAccountBeforeCRUD(req.currentUser.id, next);
            const product = yield product_1.default.updateProductById(req);
            if (!product) {
                return next(new apiError_1.NotFoundError('Product not found', new Error()));
            }
            res.status(200).json({
                success: true,
                data: product,
            });
        }
        else {
            return next(new apiError_1.BadRequestError('Please check your account', new Error()));
        }
    }
    catch (error) {
        next(new apiError_1.NotFoundError('Product not found', error));
    }
});
// POST /products
exports.createProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, categories, variants, sizes, isVariable, } = req.body;
        if (req.currentUser) {
            const user = yield checkAccountBeforeCRUD(req.currentUser.id, next);
            const product = new Product_1.default({
                name,
                description,
                categories,
                variants,
                sizes,
                isVariable,
                user: req.currentUser.id,
            });
            // Create product
            yield product_1.default.create(product);
            // Push and save new product to current user
            console.log(user.products);
            user.products.push(product._id);
            console.log(user.products);
            // const a = await User.findByIdAndUpdate(
            //   user.id,
            //   {
            //     produts: user.products,
            //   },
            //   {
            //     new: true,
            //     runValidators: true,
            //   }
            // )
            user.save();
            res.status(201).json(product);
        }
        else {
            return next(new apiError_1.BadRequestError('Please check your account', new Error()));
        }
    }
    catch (error) {
        if (error.name === 'ValidationError') {
            next(new apiError_1.BadRequestError('Invalid Request', error));
        }
        else {
            next(new apiError_1.InternalServerError('Internal Server Error', error));
        }
    }
});
// Delete /products/:id
exports.deleteProductById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield product_1.default.deleteProductById(req);
        if (!product) {
            return res.status(400).json({
                success: false,
                error: 'do not have product which has same id',
            });
        }
        res.status(200).json({
            success: true,
            data: {},
        });
    }
    catch (error) {
        next(new apiError_1.NotFoundError('Product not found', error));
    }
});
// DELETE /products
exports.deleteAll = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).json(yield product_1.default.deleteAllProducs());
    }
    catch (error) {
        next(new apiError_1.NotFoundError('Product not found', error));
    }
});
//# sourceMappingURL=product.js.map
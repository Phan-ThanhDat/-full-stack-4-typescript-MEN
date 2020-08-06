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
const Product_1 = __importDefault(require("../models/Product"));
function findAll(req) {
    const page = (req === null || req === void 0 ? void 0 : req.query.page) || 1;
    const limit = (req === null || req === void 0 ? void 0 : req.query.limit) || 10;
    const pageOptions = {
        page: page,
        limit: limit,
    };
    const skip = pageOptions.page * pageOptions.limit;
    return (Product_1.default.find()
        // .skip(skip)
        // .limit(pageOptions.limit)
        // .sort({ name: 1 })
        .exec()); // Return a Promise
}
function findProductByQueryParams(req) {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const pageOptions = {
        page: page || 0,
        limit: limit,
    };
    return (Product_1.default.find(req.query)
        // .skip(pageOptions.page * pageOptions.limit)
        // .limit(pageOptions.limit)
        .exec());
}
function findProductById(id) {
    return Product_1.default.findById(id).exec();
}
function create(product) {
    return __awaiter(this, void 0, void 0, function* () {
        return product.save();
    });
}
function updateProductById(req) {
    return __awaiter(this, void 0, void 0, function* () {
        return Product_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
    });
}
function deleteProductById(req) {
    return __awaiter(this, void 0, void 0, function* () {
        return Product_1.default.findByIdAndDelete(req.params.id);
    });
}
function deleteAllProducs() {
    return __awaiter(this, void 0, void 0, function* () {
        return Product_1.default.collection.drop();
    });
}
exports.default = {
    findAll,
    findProductById,
    findProductByQueryParams,
    create,
    updateProductById,
    deleteProductById,
    deleteAllProducs,
};
//# sourceMappingURL=product.js.map
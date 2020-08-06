"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth_1 = require("../middlewares/auth");
require('../passport');
const passport_1 = __importDefault(require("passport"));
const product_1 = require("../controllers/product");
const passportJWT = passport_1.default.authenticate('jwt', { session: false });
router.get('/filter', product_1.findProductByQuery);
router
    .route('/:id')
    .get(product_1.findProductById)
    .patch(product_1.updateProductById)
    .delete(product_1.deleteProductById);
router
    .route('/')
    .get(product_1.findAll)
    // .post(passportJWT, [protect, checkRole(['admin'])], createProduct)
    .post(passportJWT, auth_1.checkRole(['admin']), product_1.createProduct)
    .delete(product_1.deleteAll);
exports.default = router;
//# sourceMappingURL=product.js.map
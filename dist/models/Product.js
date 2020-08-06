"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ProductSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        unique: true,
    },
    description: {
        type: String,
    },
    categories: {
        type: String,
        enum: ['machine', 'fashion', 'funiture', 'food'],
        default: 'food',
    },
    variants: [
        {
            type: String,
        },
    ],
    sizes: String,
    user: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'User',
    },
    isVariable: {
        type: Boolean,
        default: true,
    },
});
exports.default = mongoose_1.default.model('Product', ProductSchema);
//# sourceMappingURL=Product.js.map
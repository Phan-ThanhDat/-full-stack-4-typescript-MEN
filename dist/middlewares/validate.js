"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemas = void 0;
const joi_1 = __importDefault(require("joi"));
exports.schemas = {
    validatePassword: joi_1.default.object().keys({
        password: joi_1.default.string().required(),
        email: joi_1.default.string().email().required(),
    }),
};
const middleware = (schema) => {
    return (req, res, next) => {
        const result = joi_1.default.validate(req.body, schema);
        console.log(result);
        if (result.error) {
            return res.status(400).json(result.error);
        }
        if (!req.value) {
            req.value = {};
        }
        req.value['body'] = result.value;
        next();
    };
};
exports.default = middleware;
//# sourceMappingURL=validate.js.map
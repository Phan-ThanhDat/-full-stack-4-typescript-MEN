"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require('../passport');
const passport_1 = __importDefault(require("passport"));
const passportLocal = passport_1.default.authenticate('local', { session: false });
const router = express_1.default.Router();
const user_1 = require("../controllers/user");
const validate_1 = __importStar(require("../middlewares/validate"));
router.post('/register', user_1.register);
router.post('/login', validate_1.default(validate_1.schemas.validatePassword), passportLocal, user_1.login);
router.post('/oauth/google', passport_1.default.authenticate('googleToken', { session: false }), user_1.login);
router.get('/logout', user_1.logout);
exports.default = router;
//# sourceMappingURL=user.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const compression_1 = __importDefault(require("compression"));
const body_parser_1 = __importDefault(require("body-parser"));
const lusca_1 = __importDefault(require("lusca"));
const mongoose_1 = __importDefault(require("mongoose"));
const bluebird_1 = __importDefault(require("bluebird"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const secrets_1 = require("./util/secrets");
const movie_1 = __importDefault(require("./routers/movie"));
const apiErrorHandler_1 = __importDefault(require("./middlewares/apiErrorHandler"));
const user_1 = __importDefault(require("./routers/user"));
const product_1 = __importDefault(require("./routers/product"));
const app = express_1.default();
const mongoUrl = secrets_1.MONGODB_URI;
mongoose_1.default.Promise = bluebird_1.default;
mongoose_1.default
    .connect(mongoUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
})
    .then(() => {
    /** ready to use. The `mongoose.connect()` promise resolves to undefined. */
})
    .catch((err) => {
    console.log('MongoDB connection error. Please make sure MongoDB is running. ' + err);
    process.exit(1);
});
// Express configuration
app.set('port', process.env.PORT || 5000);
// const PORT = process.env.PORT || 5000
// const server = app.listen(PORT, () => {})
// Use common 3rd-party middlewares
app.use(cookie_parser_1.default());
app.use(compression_1.default());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(lusca_1.default.xframe('SAMEORIGIN'));
app.use(lusca_1.default.xssProtection(true));
// importDB()
// Use movie router
app.use('/api/v1/movies', movie_1.default);
// Use user router
app.use('/api/v1/users', user_1.default);
// Use products router
app.use('/api/v1/products', product_1.default);
// Custom API error handler
app.use(apiErrorHandler_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map
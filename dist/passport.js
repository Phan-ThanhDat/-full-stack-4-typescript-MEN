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
exports.jwtStrategy = void 0;
const passport_1 = __importDefault(require("passport"));
const passport_jwt_1 = __importDefault(require("passport-jwt"));
const strategyJWT = passport_jwt_1.default.Strategy;
// const JwtStrategy = require('passport-jwt').Strategy
const passport_jwt_2 = require("passport-jwt");
const passport_local_1 = __importDefault(require("passport-local"));
const strategyLocal = passport_local_1.default.Strategy;
const passport_google_plus_token_1 = __importDefault(require("passport-google-plus-token"));
const User_1 = __importDefault(require("./models/User"));
const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['token'];
    }
    console.log(token);
    return token;
};
// JSON WEB TOKENS STRATEGY
exports.jwtStrategy = passport_1.default.use(new strategyJWT({
    // jwtFromRequest: cookieExtractor,
    jwtFromRequest: passport_jwt_2.ExtractJwt.fromAuthHeaderAsBearerToken() || cookieExtractor,
    secretOrKey: process.env.JWT_SECRET,
    passReqToCallback: true,
}, (req, payload, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('token=>>> ', req.headers.authorization);
        // console.log('user===>>>>>>', user)
        // Find the user specified in token
        const user = yield User_1.default.findById(payload.id);
        console.log('payload=>>> ', payload);
        console.log('user===>>>>>>', user);
        // If user doesn't exists, handle it
        if (!user) {
            return done(null, false);
        }
        // Otherwise, return the user
        req.currentUser = user;
        done(null, user);
    }
    catch (error) {
        done(error, false);
    }
})));
// LOCAL STRATEGY
passport_1.default.use(new strategyLocal({
    usernameField: 'email',
    passReqToCallback: true,
}, (req, email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(email, password);
        // Find the user given the email
        const user = yield User_1.default.findOne({ email }).select('+password');
        // If not, handle it
        if (!user) {
            return done(null, false);
        }
        console.log('password--> ', password);
        // Check if the password is correct
        const isMatch = yield user.matchPassword(password);
        // If not, handle it
        if (!isMatch) {
            return done(null, false);
        }
        // Otherwise, return the user
        req.currentUser = user;
        done(null, user);
    }
    catch (error) {
        done(error, false);
    }
})));
// Google OAuth Strategy
passport_1.default.use('googleToken', new passport_google_plus_token_1.default({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    passReqToCallback: true,
}, (req, accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log('profile', profile)
        // console.log('accessToken', accessToken)
        // console.log('refreshToken', refreshToken)
        const existingUser = yield User_1.default.findOne({
            googleId: profile.id,
            email: profile.emails[0]['value'],
        });
        if (!existingUser) {
            console.log(1111);
            req.currentUser = new User_1.default({
                googleId: profile.id,
                email: profile.emails[0]['value'],
                role: 'user',
            });
            yield req.currentUser.save();
            return done(null, req.currentUser);
        }
        else {
            req.currentUser = existingUser;
            return done(null, req.currentUser);
        }
    }
    catch (error) {
        done(error, false, error.message);
    }
})));
//# sourceMappingURL=passport.js.map
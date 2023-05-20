"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const session = (req, res, next) => {
    var _a;
    if (req.method === "OPTIONS")
        return next();
    req.userData = { userId: null, email: null };
    let token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (token === "" || token === undefined || token === null) {
        return next();
    }
    let decodedToken;
    try {
        decodedToken = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
    }
    catch (error) {
        console.log(error, "in decoding token in session middleware");
        return next();
    }
    if (typeof decodedToken !== "string") {
        req.userData = { userId: decodedToken.userId, email: decodedToken.email };
    }
    else {
        return next();
    }
    return next();
};
exports.default = session;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createNewToken = ({ userId, email, }) => {
    let token;
    try {
        token = jsonwebtoken_1.default.sign({ userId, email }, process.env.SECRET_KEY);
    }
    catch (error) {
        console.log("when creating token in createNewToken function", error);
        return "";
    }
    return token;
};
exports.default = createNewToken;

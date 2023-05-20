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
const error_1 = require("graphql/error");
const user_1 = __importDefault(require("../../db/models/user"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const token_1 = __importDefault(require("../../utils/token"));
const UserResolvers = {
    Mutation: {
        signup: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            if (!args.email || !args.password) {
                throw new error_1.GraphQLError("enter username and password");
            }
            const searchedUser = yield user_1.default.findOne({ email: args.email });
            if (searchedUser) {
                throw new error_1.GraphQLError("user already exists!");
            }
            let hashedPassword = "";
            try {
                hashedPassword = yield bcrypt_1.default.hash(args.password, 10);
            }
            catch (error) {
                console.log("when hashing password in signup resolver", error);
                throw new error_1.GraphQLError("Server error! pls try again later");
            }
            let newUser;
            try {
                newUser = yield user_1.default.create({
                    email: args.email,
                    password: hashedPassword,
                    username: "",
                    name: "",
                    image: "",
                    likes: [],
                    role: "user",
                });
            }
            catch (error) {
                console.log("in signup resolver", error);
                throw new error_1.GraphQLError("Server error! pls try again later");
            }
            let token = (0, token_1.default)({
                userId: newUser._id.toString(),
                email: newUser.email,
            });
            return {
                userData: {
                    email: newUser.email,
                    userId: newUser._id,
                    username: newUser.username,
                },
                token,
            };
        }),
    },
    Query: {
        login: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            const { email, password: hashedPassword } = args;
            const searchedUser = yield user_1.default.findOne({ email });
            if (!searchedUser) {
                throw new error_1.GraphQLError("Wrong Credentials!");
            }
            const passwordIsValid = yield bcrypt_1.default.compare(args.password, searchedUser.password);
            if (!passwordIsValid) {
                throw new error_1.GraphQLError("Wrond Credentials!");
            }
            let token;
            try {
                token = yield (0, token_1.default)({
                    userId: searchedUser._id.toString(),
                    email: searchedUser.email,
                });
            }
            catch (error) {
                throw new error_1.GraphQLError("Server Error! pls try again later!");
            }
            return {
                userData: {
                    email: searchedUser.email,
                    userId: searchedUser._id,
                    username: searchedUser.username,
                },
                token,
            };
        }),
    },
};
exports.default = UserResolvers;

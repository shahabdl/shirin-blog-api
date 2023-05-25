"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("./user"));
const recipes_1 = __importDefault(require("./recipes"));
const lodash_merge_1 = __importDefault(require("lodash.merge"));
const comment_1 = __importDefault(require("./comment"));
const Resolvers = (0, lodash_merge_1.default)({}, user_1.default, recipes_1.default, comment_1.default);
exports.default = Resolvers;

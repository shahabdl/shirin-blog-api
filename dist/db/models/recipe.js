"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const user_1 = __importDefault(require("./user"));
const TimingSchema = new mongoose_1.Schema({
    preperation: { type: Number, required: [true, "preperation required"] },
    cookTime: { type: Number, required: [true, "cookTime required"] },
    additional: { type: Number, required: [true, "additional required"] },
});
const LikesSchema = new mongoose_1.Schema({
    count: { type: Number },
    likedUsers: [
        {
            type: mongoose_1.default.Types.ObjectId,
            ref: user_1.default,
        },
    ],
}, { _id: false });
const IngredientSchema = new mongoose_1.Schema({
    name: { type: String, required: [true, "ingredient name required"] },
    quantity: { type: String, required: [true, "quantity required"] },
});
const RecipeSchema = new mongoose_1.Schema({
    title: { type: String, required: [true, "title required"] },
    image: { type: String, required: [true, "image required"] },
    description: { type: String, required: [true, "description required"] },
    timing: { type: TimingSchema, required: [true, "timing required"] },
    servings: { type: Number, required: [true, "servings required"] },
    difficulty: { type: String, required: [true, "difficulty required"] },
    author: {
        type: mongoose_1.default.Types.ObjectId,
        required: [true, "atuhor required"],
    },
    likes: { type: LikesSchema, required: [true, "likes required"] },
    ingredients: [
        {
            type: IngredientSchema,
            required: [true, "ingredients required"],
        },
    ],
    steps: { type: [String], required: [true, "steps required"] },
});
exports.default = mongoose_1.default.model("recipes", RecipeSchema);

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
exports.getRecipesByPage = exports.getRecipeById = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const recipe_1 = __importDefault(require("../models/recipe"));
const getRecipeById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (mongoose_1.default.isValidObjectId(id)) {
            let recipe = yield recipe_1.default.findById(id);
            return recipe === null || recipe === void 0 ? void 0 : recipe.toJSON();
        }
    }
    catch (err) {
        console.log(err);
    }
});
exports.getRecipeById = getRecipeById;
const getRecipesByPage = (perPage, offset) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let totalRecipes = yield recipe_1.default.collection.countDocuments();
        let skippingCount = perPage * (offset - 1);
        if (skippingCount > totalRecipes) {
            skippingCount = Math.floor(totalRecipes / perPage) * perPage;
        }
        let Recipes = yield recipe_1.default.find({}).sort('title').skip(skippingCount).limit(perPage);
        return { Recipes, pages: Math.ceil(totalRecipes / perPage), offset: offset };
    }
    catch (err) {
        console.log(err);
    }
});
exports.getRecipesByPage = getRecipesByPage;

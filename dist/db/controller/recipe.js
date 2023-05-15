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
exports.createRecipe = exports.likeRecipe = exports.getRecipesByPage = exports.getRecipeById = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const recipe_1 = __importDefault(require("../models/recipe"));
const user_1 = __importDefault(require("../models/user"));
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
        if (perPage < 1) {
            perPage = 1;
        }
        if (offset < 1) {
            offset = 1;
        }
        let skippingCount = perPage * (offset - 1);
        if (skippingCount > totalRecipes) {
            skippingCount = Math.floor(totalRecipes / perPage) * perPage;
        }
        let Recipes = yield recipe_1.default
            .find({})
            .sort("title")
            .skip(skippingCount)
            .limit(perPage);
        return {
            Recipes,
            pages: Math.ceil(totalRecipes / perPage),
            offset: offset,
        };
    }
    catch (err) {
        console.log("getRecipesByPage", err);
    }
});
exports.getRecipesByPage = getRecipesByPage;
const likeRecipe = (userId, recipeId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let recipe = yield recipe_1.default.findByIdAndUpdate(recipeId);
        if (recipe) {
            for (let user in recipe.likes.likedUsers) {
                if (recipe.likes.likedUsers[Number(user)].toString() === userId.toString()) {
                    return recipe.toJSON();
                }
            }
            let requestedUser = yield user_1.default.findByIdAndUpdate(userId);
            if (requestedUser) {
                if (recipe.likes.count) {
                    recipe.likes.count += 1;
                }
                else {
                    recipe.likes.count = 1;
                }
                recipe.likes.likedUsers.push(requestedUser._id);
                let duplicate = false;
                for (let key in requestedUser.likes) {
                    if (requestedUser.likes[key].toString() === recipeId.toString()) {
                        duplicate = true;
                        break;
                    }
                }
                if (!duplicate) {
                    requestedUser.likes.push(recipeId);
                }
                recipe.save();
                requestedUser.save();
                return recipe.toJSON();
            }
        }
        return;
    }
    catch (err) {
        console.log(err);
    }
});
exports.likeRecipe = likeRecipe;
const createRecipe = ({ recipeArgs, session }) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(recipeArgs);
});
exports.createRecipe = createRecipe;

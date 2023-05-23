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
const graphql_1 = require("graphql");
const user_1 = __importDefault(require("../../db/models/user"));
const mongoose_1 = __importDefault(require("mongoose"));
const recipe_1 = __importDefault(require("../../db/models/recipe"));
const get_output_1 = __importDefault(require("../../output_texts/get-output"));
const categories_1 = __importDefault(require("../../db/models/categories"));
const RecipeResolvers = {
    Query: {
        Recipes: (_, __, context) => __awaiter(void 0, void 0, void 0, function* () {
            console.log(context);
            return "test";
        }),
    },
    Mutation: {
        CreateRecipe: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            if (!context.userData || !context.userData.userId) {
                throw new graphql_1.GraphQLError((0, get_output_1.default)("NOT_AUTHORIZED_MESSAGE", "EN"));
            }
            const { userId, email } = context.userData;
            if (!mongoose_1.default.isValidObjectId(userId)) {
                throw new graphql_1.GraphQLError((0, get_output_1.default)("NOT_AUTHORIZED_MESSAGE", "EN"));
            }
            const requestingUser = yield user_1.default.findById(userId);
            if (!requestingUser) {
                throw new graphql_1.GraphQLError((0, get_output_1.default)("NOT_AUTHORIZED_MESSAGE", "EN"));
            }
            if (requestingUser.email !== email) {
                throw new graphql_1.GraphQLError((0, get_output_1.default)("NOT_AUTHORIZED_MESSAGE", "EN"));
            }
            if (requestingUser.role !== "author") {
                throw new graphql_1.GraphQLError((0, get_output_1.default)("NOT_AUTHORIZED_MESSAGE", "EN"));
            }
            const recipeData = args.recipeData;
            console.log(recipeData);
            let categoriesID = [];
            for (let catIndex in recipeData.categories) {
                let categoryID = yield categories_1.default.findOne({
                    name: recipeData.categories[catIndex],
                });
                if (!categoryID) {
                    categoryID = yield categories_1.default.create({
                        name: recipeData.categories[catIndex],
                        image: "",
                        status: "PUBLISHED",
                        description: "",
                    });
                }
                categoriesID.push(categoryID._id);
            }
            const newRecipe = yield recipe_1.default.create({
                name: recipeData.name,
                title: recipeData.title,
                description: recipeData.description,
                difficulty: recipeData.difficulty,
                ingredients: [...recipeData.ingredients],
                categories: [...categoriesID],
                steps: [...recipeData.steps],
                status: recipeData.status,
                image: recipeData.image,
                timing: Object.assign({}, recipeData.timing),
                servings: recipeData.servings,
                likes: {},
                author: userId,
            });
            yield user_1.default.findByIdAndUpdate(userId, {
                $push: { recipes: newRecipe._id },
            });
            return newRecipe.toObject();
        }),
    },
};
exports.default = RecipeResolvers;

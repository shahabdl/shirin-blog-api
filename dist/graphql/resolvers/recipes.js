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
const ingredients_1 = __importDefault(require("../../db/models/ingredients"));
const RecipeResolvers = {
    Query: {
        Recipes: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
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
            let IngredientsID = [];
            for (let index in recipeData.ingredients) {
                const name = recipeData.ingredients[index].name;
                const id = recipeData.ingredients[index].id;
                let ingredient;
                if (id && mongoose_1.default.Types.ObjectId.isValid(id)) {
                    ingredient = yield ingredients_1.default.findById(id);
                }
                else if (name) {
                    ingredient = yield ingredients_1.default.findOne({ name });
                }
                else {
                    throw new graphql_1.GraphQLError((0, get_output_1.default)("INGREDIENT_DONT_HAVE_DATA", "EN"));
                }
                if (!ingredient) {
                    if (!name) {
                        throw new graphql_1.GraphQLError((0, get_output_1.default)("INGREDIENT_NOT_EXISTS_WITH_THIS_ID", "EN"));
                    }
                    try {
                        ingredient = yield ingredients_1.default.create({
                            name,
                            image: "",
                            description: "",
                        });
                    }
                    catch (error) {
                        throw new graphql_1.GraphQLError((0, get_output_1.default)("SERVER_ERROR_500", "EN"));
                    }
                }
                IngredientsID.push({
                    ingredient: ingredient._id,
                    quantity: recipeData.ingredients[index].quantity,
                });
            }
            const newRecipe = yield recipe_1.default.create({
                name: recipeData.name,
                title: recipeData.title,
                description: recipeData.description,
                difficulty: recipeData.difficulty,
                ingredients: [...IngredientsID],
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
    CreateRecipeResponse: {
        categories: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            let categories = [];
            for (let catIndex in parent.categories) {
                var categoryData = yield categories_1.default.findById(parent.categories[catIndex]);
                if (categoryData) {
                    categories.push({ id: categoryData._id, name: categoryData.name });
                }
            }
            return categories;
        }),
        ingredients: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            let ingredientList = [];
            for (let index in parent.ingredients) {
                const id = parent.ingredients[index].ingredient;
                var ingredientData = yield ingredients_1.default.findById(id);
                if (ingredientData) {
                    ingredientList.push({
                        id: id,
                        name: ingredientData.name,
                        quantity: parent.ingredients[index].quantity,
                    });
                }
            }
            return ingredientList;
        }),
    },
};
exports.default = RecipeResolvers;

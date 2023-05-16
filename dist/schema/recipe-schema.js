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
const mongoose_1 = __importDefault(require("mongoose"));
const recipe_1 = require("../db/controller/recipe");
const user_1 = require("../db/controller/user");
const recipeGQLTypes_1 = require("./recipeGQLTypes");
/**
 * Queries
 */
const RecipeRootQuery = new graphql_1.GraphQLObjectType({
    name: "RecipeRootQuery",
    fields: {
        Author: {
            type: recipeGQLTypes_1.UserType,
            args: { id: { type: graphql_1.GraphQLID } },
            resolve(parent, args) {
                return (0, user_1.getUserById)(args.id).then((user) => {
                    if (user && user.role === "author") {
                        return user;
                    }
                    return null;
                });
            },
        },
        Recipes: {
            type: recipeGQLTypes_1.ReciptPaginationType,
            args: { perPage: { type: graphql_1.GraphQLInt }, offset: { type: graphql_1.GraphQLInt } },
            resolve(parent, args) {
                return __awaiter(this, void 0, void 0, function* () {
                    let test = yield (0, recipe_1.getRecipesByPage)(args.perPage, args.offset);
                    return (0, recipe_1.getRecipesByPage)(args.perPage, args.offset);
                });
            },
        },
        Recipe: {
            type: recipeGQLTypes_1.RecipeType,
            args: { id: { type: graphql_1.GraphQLID } },
            resolve(parent, args) {
                return (0, recipe_1.getRecipeById)(args.id);
            },
        },
    },
});
// Mutations
const mutation = new graphql_1.GraphQLObjectType({
    name: "Mutation",
    fields: {
        likeRecipe: {
            type: recipeGQLTypes_1.RecipeType,
            args: {
                recipeId: { type: graphql_1.GraphQLID },
            },
            resolve(_, args) {
                const id = new mongoose_1.default.Types.ObjectId("6431e289ea7813179ea1b567");
                return (0, recipe_1.likeRecipe)(id, args.recipeId);
            },
        },
        createRecipe: {
            type: recipeGQLTypes_1.RecipeType,
            args: {
                recipeArgs: { type: recipeGQLTypes_1.RecipeCreateInputType },
            },
            resolve(_, args, context) {
                return (0, recipe_1.createRecipe)({ recipeArgs: args.recipeArgs, session: context.session });
            },
        },
    },
});
exports.default = new graphql_1.GraphQLSchema({ query: RecipeRootQuery, mutation });

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
const UserType = new graphql_1.GraphQLObjectType({
    name: "User",
    fields: () => ({
        _id: { type: graphql_1.GraphQLID },
        name: { type: graphql_1.GraphQLString },
        image: { type: graphql_1.GraphQLString },
        role: { type: graphql_1.GraphQLString },
    }),
});
const LikesType = new graphql_1.GraphQLObjectType({
    name: "Likes",
    fields: () => ({
        count: { type: graphql_1.GraphQLInt },
        likedUsers: {
            type: (0, graphql_1.GraphQLList)(UserType),
            resolve(parent, args) {
                return __awaiter(this, void 0, void 0, function* () {
                    let usersList = [];
                    for (let user in parent.likedUsers) {
                        usersList.push(yield (0, user_1.getUserById)(parent.likedUsers[user]));
                    }
                    return [...usersList];
                });
            },
        },
    }),
});
const TimingType = new graphql_1.GraphQLObjectType({
    name: "Timing",
    fields: () => ({
        preperation: { type: graphql_1.GraphQLInt },
        cookTime: { type: graphql_1.GraphQLInt },
        additional: { type: graphql_1.GraphQLInt },
    }),
});
const RecipeType = new graphql_1.GraphQLObjectType({
    name: "Recipe",
    fields: () => ({
        id: { type: graphql_1.GraphQLID },
        image: { type: graphql_1.GraphQLString },
        title: { type: graphql_1.GraphQLString },
        description: { type: graphql_1.GraphQLString },
        timing: { type: TimingType },
        difficulty: { type: graphql_1.GraphQLString },
        likes: { type: LikesType },
        userLiked: { type: graphql_1.GraphQLBoolean },
        author: {
            type: UserType,
            resolve(parent, args) {
                return (0, user_1.getUserById)(parent.author);
            },
        },
    }),
});
const ReciptPaginationType = new graphql_1.GraphQLObjectType({
    name: "RecipePaggination",
    fields: () => ({
        Recipes: { type: (0, graphql_1.GraphQLList)(RecipeType) },
        pages: { type: graphql_1.GraphQLInt },
        offset: { type: graphql_1.GraphQLInt },
    }),
});
const RecipeRootQuery = new graphql_1.GraphQLObjectType({
    name: "RecipeRootQuery",
    fields: {
        Author: {
            type: UserType,
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
            type: ReciptPaginationType,
            args: { perPage: { type: graphql_1.GraphQLInt }, offset: { type: graphql_1.GraphQLInt } },
            resolve(parent, args) {
                return __awaiter(this, void 0, void 0, function* () {
                    let test = yield (0, recipe_1.getRecipesByPage)(args.perPage, args.offset);
                    return (0, recipe_1.getRecipesByPage)(args.perPage, args.offset);
                });
            },
        },
        Recipe: {
            type: RecipeType,
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
            type: RecipeType,
            args: {
                recipeId: { type: graphql_1.GraphQLID },
            },
            resolve(parent, args) {
                const id = new mongoose_1.default.Types.ObjectId("6431e289ea7813179ea1b567");
                return (0, recipe_1.likeRecipe)(id, args.recipeId);
            },
        },
    },
});
exports.default = new graphql_1.GraphQLSchema({ query: RecipeRootQuery, mutation });

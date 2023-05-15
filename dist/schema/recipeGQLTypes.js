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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReciptPaginationType = exports.RecipeType = exports.TimingType = exports.LikesType = exports.UserType = exports.RecipeInputType = void 0;
const graphql_1 = require("graphql");
const user_1 = require("../db/controller/user");
exports.RecipeInputType = new graphql_1.GraphQLInputObjectType({
    name: "RecipeInputTpe",
    fields: {
        name: { type: graphql_1.GraphQLString },
    },
});
exports.UserType = new graphql_1.GraphQLObjectType({
    name: "User",
    fields: () => ({
        _id: { type: graphql_1.GraphQLID },
        name: { type: graphql_1.GraphQLString },
        image: { type: graphql_1.GraphQLString },
        role: { type: graphql_1.GraphQLString },
    }),
});
exports.LikesType = new graphql_1.GraphQLObjectType({
    name: "Likes",
    fields: () => ({
        count: { type: graphql_1.GraphQLInt },
        likedUsers: {
            type: (0, graphql_1.GraphQLList)(exports.UserType),
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
exports.TimingType = new graphql_1.GraphQLObjectType({
    name: "Timing",
    fields: () => ({
        preperation: { type: graphql_1.GraphQLInt },
        cookTime: { type: graphql_1.GraphQLInt },
        additional: { type: graphql_1.GraphQLInt },
    }),
});
exports.RecipeType = new graphql_1.GraphQLObjectType({
    name: "Recipe",
    fields: () => ({
        id: { type: graphql_1.GraphQLID },
        image: { type: graphql_1.GraphQLString },
        title: { type: graphql_1.GraphQLString },
        description: { type: graphql_1.GraphQLString },
        timing: { type: exports.TimingType },
        difficulty: { type: graphql_1.GraphQLString },
        likes: { type: exports.LikesType },
        userLiked: { type: graphql_1.GraphQLBoolean },
        author: {
            type: exports.UserType,
            resolve(parent, args) {
                return (0, user_1.getUserById)(parent.author);
            },
        },
    }),
});
exports.ReciptPaginationType = new graphql_1.GraphQLObjectType({
    name: "RecipePaggination",
    fields: () => ({
        Recipes: { type: (0, graphql_1.GraphQLList)(exports.RecipeType) },
        pages: { type: graphql_1.GraphQLInt },
        offset: { type: graphql_1.GraphQLInt },
    }),
});

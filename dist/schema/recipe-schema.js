"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const recipe_1 = require("../db/controller/recipe");
const user_1 = require("../db/controller/user");
const UserType = new graphql_1.GraphQLObjectType({
    name: "User",
    fields: () => ({
        id: { type: graphql_1.GraphQLID },
        name: { type: graphql_1.GraphQLString },
        image: { type: graphql_1.GraphQLString },
        role: { type: graphql_1.GraphQLString },
    }),
});
const LikesType = new graphql_1.GraphQLObjectType({
    name: "Likes",
    fields: () => ({
        count: { type: graphql_1.GraphQLInt },
        users: {
            type: (0, graphql_1.GraphQLList)(UserType),
            resolve(parent, args) {
                let usersList = [];
                for (let user in parent.users) {
                    usersList.push((0, user_1.getUserById)(parent.users[user]));
                }
                return [...usersList];
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
        Recipe: {
            type: RecipeType,
            args: { id: { type: graphql_1.GraphQLID } },
            resolve(parent, args) {
                return (0, recipe_1.getRecipeById)(args.id);
            },
        },
    },
});
exports.default = new graphql_1.GraphQLSchema({ query: RecipeRootQuery });

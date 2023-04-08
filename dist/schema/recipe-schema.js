"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const mockData_1 = require("../mockData");
const AuthorType = new graphql_1.GraphQLObjectType({
    name: "Author",
    fields: () => ({
        name: { type: graphql_1.GraphQLString },
        image: { type: graphql_1.GraphQLString },
    }),
});
const RecipeType = new graphql_1.GraphQLObjectType({
    name: "Recipe",
    fields: () => ({
        id: { type: graphql_1.GraphQLID },
        image: { type: graphql_1.GraphQLString },
        title: { type: graphql_1.GraphQLString },
        description: { type: graphql_1.GraphQLString },
        cookTime: { type: graphql_1.GraphQLInt },
        difficulty: { type: graphql_1.GraphQLString },
        likes: { type: graphql_1.GraphQLInt },
        userLiked: { type: graphql_1.GraphQLBoolean },
        author: {
            type: AuthorType,
            resolve(parent, args) {
                return mockData_1.Authors[parent.author];
            },
        },
    }),
});
const RootQuery = new graphql_1.GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        Authors: {
            type: new graphql_1.GraphQLList(AuthorType),
            resolve(parent) {
                return mockData_1.Authors;
            },
        },
        Author: {
            type: AuthorType,
            args: { id: { type: graphql_1.GraphQLID } },
            resolve(parent, args) {
                return mockData_1.Authors[Number(args.id)];
            },
        },
        Recipes: {
            type: new graphql_1.GraphQLList(RecipeType),
            resolve(parent) {
                return mockData_1.MockData;
            },
        },
        Recipe: {
            type: RecipeType,
            args: { id: { type: graphql_1.GraphQLID } },
            resolve(parent, args) {
                return mockData_1.MockData[Number(args.id)];
            },
        },
    },
});
exports.default = new graphql_1.GraphQLSchema({ query: RootQuery });

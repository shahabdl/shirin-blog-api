"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecipeInputType = void 0;
const graphql_1 = require("graphql");
exports.RecipeInputType = new graphql_1.GraphQLInputObjectType({
    name: "RecipeInputTpe",
    fields: {
        name: { type: graphql_1.GraphQLString },
    },
});

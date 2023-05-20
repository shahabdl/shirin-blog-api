"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RecipeTypeDefs = `#graphql
    type CreateRecipeResponse {
        test: String
    }
    type Query {
        Recipes: String
    }
    type Mutation{
        CreateRecipe(name:String) : CreateRecipeResponse
    }
`;
exports.default = RecipeTypeDefs;

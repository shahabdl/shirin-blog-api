"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RecipeTypeDefs = `#graphql
    type CreateRecipeResponse {
        title:String,
        author: String,
        description: String,
    }
    enum Difficulty{
        EASY
        MEDIUM
        HARD
    }
    enum PublishStatus{
        PUBLISHED
        DRAFT
        TRASH
    }
    type Query {
        Recipes: String
    }
    input Ingredients{
        name: String
        quantity: Int
    }
    input Timing{
        preperation: Int
        cookTime: Int
        additional: Int
    }
    input CreateRecipeArgs{
        name: String
        title: String
        description:String
        difficulty: Difficulty
        ingredients: [Ingredients]
        categories: [ID]
        steps: [String]
        status: PublishStatus
        image: String
        timing: Timing
        servings: Int
    }
    type Mutation{
        CreateRecipe(recipeData:CreateRecipeArgs) : CreateRecipeResponse
    }
`;
exports.default = RecipeTypeDefs;

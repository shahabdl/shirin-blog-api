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
`
export default RecipeTypeDefs
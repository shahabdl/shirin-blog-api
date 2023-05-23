const RecipeTypeDefs = `#graphql
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

    input IngredientsInput{
        name: String
        quantity: String
    }
    input TimingInput{
        preperation: Int
        cookTime: Int
        additional: Int
    }
    input CreateRecipeArgs{
        name: String
        title: String
        description:String
        difficulty: Difficulty
        ingredients: [IngredientsInput]
        categories: [String]
        steps: [String]
        status: PublishStatus
        image: String
        timing: TimingInput
        servings: Int
        vip: Boolean
    }

    type Ingredients{
        name: String
        quantity: String
    }
    type TimingType{
        preperation: Int
        cookTime: Int
        additional: Int
    }
    type Category{
        id:ID
        name: String
    }
    type CreateRecipeResponse {
        id: ID
        name: String
        title:String
        author: String
        description: String
        difficulty: Difficulty
        ingredients: [Ingredients]
        categories: [Category]
        steps: [String]
        status: PublishStatus
        image: String
        timing: TimingType
        servings: Int
        vip: Boolean
    }
    type Mutation{
        CreateRecipe(recipeData:CreateRecipeArgs) : CreateRecipeResponse
    }

`;
export default RecipeTypeDefs;

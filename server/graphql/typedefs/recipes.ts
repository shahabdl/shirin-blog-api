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
        Recipes(first: Int, offset: Int): [getRecipesResult]
        getSingleRecipeById(Id: ID): getRecipesResult
        getRecipesByCategory(category: String, first: Int, offset: Int): [getRecipesResult]
    }
    type Mutation{
        CreateRecipe(recipeData:CreateRecipeArgs) : CreateRecipeResponse
        updateRecipe(id: ID, recipeData: CreateRecipeArgs) : CreateRecipeResponse
    }

    type getRecipesResult {
        id: ID
        name: String
        title:String
        author: UserData
        description: String
        difficulty: Difficulty
        ingredients: [QuantisedIngredient]
        categories: [Category]
        comments: [Comment]
        steps: [String]
        status: PublishStatus
        image: String
        timing: TimingType
        servings: Int
        vip: Boolean
    }
    
    input IngredientsInput{
        id: String
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

    type Ingredient{
        author: UserData
        name: String
        id: ID
        description: String
        image: String
    }
    type QuantisedIngredient{
        ingredient: Ingredient
        quantity: String
    }
    type TimingType{
        preperation: Int
        cookTime: Int
        additional: Int
    }
    type Category{
        author: UserData
        id: ID
        name: String
    }
    type CreateRecipeResponse {
        id: ID
        name: String
        title:String
        author: UserData
        description: String
        difficulty: Difficulty
        ingredients: [QuantisedIngredient]
        categories: [Category]
        comments: [Comment]
        steps: [String]
        status: PublishStatus
        image: String
        timing: TimingType
        servings: Int
        vip: Boolean
    }
`;
export default RecipeTypeDefs;

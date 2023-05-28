export const createRecipeMutation = 
    `mutation CreateRecipe($recipeData: CreateRecipeArgs) {
        CreateRecipe(recipeData: $recipeData) {
            title
            author {
                id
                username
            }
            description
            difficulty
            id
            image
            name
            servings
            status
            steps
            timing {
                preperation
                cookTime
                additional
            }
            vip
            categories {
                author {
                id
                username
                }
                name
                id
            }
            ingredients {
                ingredient {
                author {
                    username
                }
                id
                name
                }
                quantity
            }
        }
    }`;
export const createReciptMutationVariables = {
  recipeData: {
    categories: ["vegan", "dog food", "shashoo"],
    description: "lorem ipsum",
    image: "test.jpg",
    ingredients: [
      {
        name: "egg",
        quantity: "2",
      },
      {
        name: "bean",
        quantity: "20g",
      },
    ],
    name: "Recipe_1",
    servings: 4,
    status: "PUBLISHED",
    steps: ["step 1", "step 2", "step 3"],
    timing: {
      additional: 15,
      cookTime: 12,
      preperation: 16,
    },
    title: "food for dogs",
    vip: false,
    difficulty: "MEDIUM",
  },
};

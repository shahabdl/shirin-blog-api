export const createRecipeMutation = `mutation CreateRecipe($recipeData: CreateRecipeArgs) {
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
    categories: ["cat_1", "cat_2", "cat_3"],
    description: "lorem ipsum",
    image: "test.jpg",
    ingredients: [
      {
        name: "ingredient_1",
        quantity: "2",
      },
      {
        name: "ingredient_2",
        quantity: "20g",
      },
    ],
    name: "Recipe_1",
    servings: 4,
    status: "PUBLISHED",
    steps: ["step 1", "step 2", "step 3"],
    timing: {
      additional: 1,
      cookTime: 2,
      preperation: 3,
    },
    title: "test title",
    vip: false,
    difficulty: "MEDIUM",
  },
};

export const CreateRecipeResult = {
  title: "test title",
  description: "lorem ipsum",
  difficulty: "MEDIUM",
  image: "test.jpg",
  name: "Recipe_1",
  servings: 4,
  status: "PUBLISHED",
  steps: ["step 1", "step 2", "step 3"],
  timing: {
    preperation: 3,
    cookTime: 2,
    additional: 1,
  },
  vip: false,
  categories: [
    {
      name: "cat_1",
    },
    {
      name: "cat_2",
    },
    {
      name: "cat_3",
    },
  ],
  ingredients: [
    {
      ingredient: {
        name: "ingredient_1",
      },
      quantity: "2",
    },
    {
      ingredient: {
        name: "ingredient_2",
      },
      quantity: "20g",
    },
  ],
};

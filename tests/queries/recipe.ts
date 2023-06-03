interface createRecipeMutationVariablesOptions extends Object {
  categories?: [string];
  description?: string;
  image?: string;
  ingredients?: [{ name: string; quantity: string }];
  name?: string;
  servings?: string;
  status?: "PUBLISHED" | "DRAFT" | "TRASH";
  steps?: [string];
  timing?: { additional: number; cookTime: number; preperation: number };
  title?: string;
  vip?: boolean;
  difficulty?: "EASY" | "MEDIUM" | "HARD";
}

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

export const createReciptMutationVariables = (
  options: createRecipeMutationVariablesOptions = {}
) => {
  let defaultObject = {
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
  let result = { recipeData: {} };
  result.recipeData = { ...defaultObject.recipeData, ...options };
  return result;
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

export const queryGetRecipes = `
query GetRecipes($first: Int, $offset: Int) {
  Recipes(first: $first, offset: $offset) {
    id
    name
    author {
      email
      id
      username
    }
    categories {
      author {
        username
      }
      id
      name
    }
    description
    difficulty
    image
    ingredients {
      ingredient {
        author {
          username
        }
        description
        image
        name
        id
      }
      quantity
    }
    servings
    status
    steps
    timing {
      additional
      cookTime
      preperation
    }
    title
    vip
  }
}
`;
export const queryGetRecipesVariables = {
  first: 5,
  offset: 1,
};
export const queryGetRecipesResult = [
  { name: "Recipe_5", image: "Recipe_5_Image.jpg" },
  { name: "Recipe_6", image: "Recipe_6_Image.jpg" },
  { name: "Recipe_7", image: "Recipe_7_Image.jpg" },
  { name: "Recipe_8", image: "Recipe_8_Image.jpg" },
  { name: "Recipe_9", image: "Recipe_9_Image.jpg" },
];

export const queryGetSingleRecipeById= `
query GetSingleRecipeById($id: ID) {
  getSingleRecipeById(Id: $id) {
    id
    name
    author {
      email
      id
      username
    }
    categories {
      author {
        username
      }
      id
      name
    }
    description
    difficulty
    image
    ingredients {
      ingredient {
        author {
          username
        }
        description
        image
        name
        id
      }
      quantity
    }
    servings
    status
    steps
    timing {
      additional
      cookTime
      preperation
    }
    title
    vip
  }
}
`
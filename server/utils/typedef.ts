import mongoose from "mongoose";

/** ENUMS */
enum Difficulty {
  EASY = "EASY",
  MEDIUM = "MEDIUM",
  HARD = "MEDIUM",
}
enum Status {
  PUBLISHED = "PUBLISHED",
  DRAFT = "DRAFT",
  TRASH = "TRASH",
}

/**TYPES */
export interface GraphQlContext {
  userData: UserData;
}
export interface CreateRecipeArgs {
  recipeData: {
    name: string;
    title: string;
    description: string;
    difficulty: Difficulty;
    ingredients: [
      {
        id?: string;
        name?: string;
        quantity: string;
      }
    ];
    categories: [string];
    steps: [string];
    status: Status;
    image: string;
    timing: {
      preperation: Number;
      cookTime: Number;
      additional: Number;
    };
    servings: Number;
  };
}
export interface UserData {
  userId: mongoose.Types.ObjectId;
  email: string;
}
export interface AuthArgs {
  email: string;
  password: string;
}
export interface GetRecipesArgs {
  first: number;
  offset: number;
}

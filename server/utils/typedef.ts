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
    name: String;
    title: String;
    description: String;
    difficulty: Difficulty;
    ingredients: [
      {
        name: String;
        quantity: String;
      }
    ];
    categories: [String];
    steps: [String];
    status: Status;
    image: String;
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

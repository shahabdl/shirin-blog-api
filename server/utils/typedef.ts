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
    vip: boolean;
    servings: Number;
  };
}

export interface UpdateRecipeArgs {
  id: mongoose.Types.ObjectId;
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
    vip: boolean;
    servings: Number;
  };
}

export interface UserData {
  userId: mongoose.Types.ObjectId;
  email: string;
  role: "Author" | "User";
  isVIP: Boolean;
}
export interface AuthArgs {
  email: string;
  password: string;
}
export interface GetRecipesArgs {
  first: number;
  offset: number;
}
export interface GetRecipesByCatArgs {
  category: string;
  first: number;
  offset: number;
}
export interface CreateCommentArgs {
  createCommentArgs: {
    recipe: mongoose.Types.ObjectId;
    title: mongoose.Types.ObjectId;
    content: string;
    parent: mongoose.Types.ObjectId;
  };
}

export interface GetSingleRecipeByIdArgs {
  Id: string;
}

export interface LikeRecipeArgs {
  id: mongoose.Types.ObjectId;
}
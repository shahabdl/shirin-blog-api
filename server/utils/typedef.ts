import mongoose from "mongoose";

export interface UserData {
  userId: mongoose.Types.ObjectId;
  email: string;
}
export interface GraphQlContext {
  userData: UserData;
}
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
export interface RecipeArgs {
  name: String;
  image: String;
  title: String;
  description: String;
  difficulty: Difficulty;
  status: Status;
  timing: {
    preperation: Number;
    cookTime: Number;
    additional: Number;
  };
  servings: Number;
}
export interface SignupArgs {
  email: string;
  password: string;
}

import { GraphQLArgs, GraphQLObjectType } from "graphql";
import mongoose from "mongoose";

export interface Session {
  userId: mongoose.Types.ObjectId;
}

export interface GraphQlContext {
  session: Session;
}

enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'MEDIUM',
}
enum Status {
  PUBLISHED = 'PUBLISHED',
  DRAFT = 'DRAFT',
  TRASH = 'TRASH',
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

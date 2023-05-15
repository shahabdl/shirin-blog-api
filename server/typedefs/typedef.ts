import { GraphQLArgs, GraphQLObjectType } from "graphql";
import mongoose from "mongoose";
import { RecipeCreateInputType } from "../schema/recipeGQLTypes";

export interface Session {
  userId: mongoose.Types.ObjectId;
}

export interface GraphQlContext{
    session: Session;
}

enum difficulty {
    EASY = 0,
    MEDIUM = 1,
    HARD = 2
}
export interface RecipeArgs{
    name: String,
    image: String,
    title: String,
    description: String,
    difficulty: difficulty,
    timing:{
        preperation: Number,
        cookTime: Number,
        additional: Number
    }
}


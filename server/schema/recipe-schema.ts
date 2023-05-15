import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLInt,
  GraphQLSchema,
} from "graphql";
import mongoose from "mongoose";
import {
  createRecipe,
  getRecipeById,
  getRecipesByPage,
  likeRecipe,
} from "../db/controller/recipe";
import { getUserById } from "../db/controller/user";
import {
  RecipeCreateInputType,
  RecipeType,
  ReciptPaginationType,
  UserType,
} from "./recipeGQLTypes";
import { GraphQlContext } from "../typedefs/typedef";

/**
 * Queries
 */
const RecipeRootQuery = new GraphQLObjectType({
  name: "RecipeRootQuery",
  fields: {
    Author: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return getUserById(args.id).then((user) => {
          if (user && user.role === "author") {
            return user;
          }
          return null;
        });
      },
    },
    Recipes: {
      type: ReciptPaginationType,
      args: { perPage: { type: GraphQLInt }, offset: { type: GraphQLInt } },
      async resolve(parent, args) {
        let test = await getRecipesByPage(args.perPage, args.offset);
        return getRecipesByPage(args.perPage, args.offset);
      },
    },
    Recipe: {
      type: RecipeType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return getRecipeById(args.id);
      },
    },
  },
});

// Mutations
const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    likeRecipe: {
      type: RecipeType,
      args: {
        recipeId: { type: GraphQLID },
      },
      resolve(parent, args) {
        const id = new mongoose.Types.ObjectId("6431e289ea7813179ea1b567");
        return likeRecipe(id, args.recipeId);
      },
    },
    createRecipe: {
      type: RecipeType,
      args: {
        recipeArgs: { type: RecipeCreateInputType },
      },
      resolve(_: any, args, context: GraphQlContext) {
        createRecipe({ recipeArgs: args.recipeArgs, session: context.session });
      },
    },
  },
});

export default new GraphQLSchema({ query: RecipeRootQuery, mutation });

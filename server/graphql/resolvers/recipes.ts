import { GraphQLError } from "graphql";
import { CreateRecipeArgs, GraphQlContext } from "../../utils/typedef";
import user from "../../db/models/user";
import mongoose from "mongoose";
import { EN } from "../../output_texts/errors";
import recipe from "../../db/models/recipe";

const RecipeResolvers = {
  Query: {
    Recipes: async (_: any, __: any, context: GraphQlContext) => {
      console.log(context);

      return "test";
    },
  },

  Mutation: {
    CreateRecipe: async (
      _: any,
      args: CreateRecipeArgs,
      context: GraphQlContext
    ) => {
      if (!context.userData || !context.userData.userId) {
        throw new GraphQLError(EN.Error.NOT_AUTHORIZED_MESSAGE);
      }
      const { userId, email } = context.userData;
      if (!mongoose.isValidObjectId(userId)) {
        throw new GraphQLError(EN.Error.NOT_AUTHORIZED_MESSAGE);
      }
      const requestingUser = await user.findById(userId);
      if (!requestingUser) {
        throw new GraphQLError(EN.Error.NOT_AUTHORIZED_MESSAGE);
      }
      if (requestingUser.email !== email) {
        throw new GraphQLError(EN.Error.NOT_AUTHORIZED_MESSAGE);
      }
      if (requestingUser.role !== "author") {
        throw new GraphQLError(EN.Error.NOT_AUTHORIZED_MESSAGE);
      }
      const recipeData = args.recipeData;
      const newRecipe = await recipe.create({
        name: recipeData.name,
        title: recipeData.title,
        description: recipeData.description,
        difficulty: recipeData.difficulty,
        ingredients: [...recipeData.ingredients],
        categories: [...recipeData.categories],
        steps: [...recipeData.steps],
        status: recipeData.status,
        image: recipeData.image,
        timing: { ...recipeData.timing },
        servings: recipeData.servings,
        likes: {},
        author: userId,
      });
      await user.findByIdAndUpdate(userId, {
        $push: { recipes: newRecipe._id },
      });
      return newRecipe.toObject();
    },
  },
};
export default RecipeResolvers;

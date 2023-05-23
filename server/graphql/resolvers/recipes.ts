import { GraphQLError } from "graphql";
import { CreateRecipeArgs, GraphQlContext } from "../../utils/typedef";
import user from "../../db/models/user";
import mongoose from "mongoose";
import recipe from "../../db/models/recipe";
import getText from "../../output_texts/get-output";
import category from "../../db/models/categories";

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
        throw new GraphQLError(getText("NOT_AUTHORIZED_MESSAGE", "EN"));
      }
      const { userId, email } = context.userData;
      if (!mongoose.isValidObjectId(userId)) {
        throw new GraphQLError(getText("NOT_AUTHORIZED_MESSAGE", "EN"));
      }
      const requestingUser = await user.findById(userId);
      if (!requestingUser) {
        throw new GraphQLError(getText("NOT_AUTHORIZED_MESSAGE", "EN"));
      }
      if (requestingUser.email !== email) {
        throw new GraphQLError(getText("NOT_AUTHORIZED_MESSAGE", "EN"));
      }
      if (requestingUser.role !== "author") {
        throw new GraphQLError(getText("NOT_AUTHORIZED_MESSAGE", "EN"));
      }
      const recipeData = args.recipeData;
      console.log(recipeData)
      let categoriesID = [];
      for (let catIndex in recipeData.categories) {
        let categoryID = await category.findOne({
          name: recipeData.categories[catIndex],
        });
        if (!categoryID) {
          categoryID = await category.create({
            name: recipeData.categories[catIndex],
            image: "",
            status: "PUBLISHED",
            description: "",
          });
        }
        categoriesID.push(categoryID._id);
      }
      
      const newRecipe = await recipe.create({
        name: recipeData.name,
        title: recipeData.title,
        description: recipeData.description,
        difficulty: recipeData.difficulty,
        ingredients: [...recipeData.ingredients],
        categories: [...categoriesID],
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

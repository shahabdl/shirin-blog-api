import { GraphQLError } from "graphql";
import {
  CreateRecipeArgs,
  GetRecipesArgs,
  GraphQlContext,
} from "../../utils/typedef";
import user from "../../db/models/user";
import mongoose from "mongoose";
import recipe from "../../db/models/recipe";
import getText from "../../output_texts/get-output";
import category from "../../db/models/categories";
import ingredients from "../../db/models/ingredients";

const RecipeResolvers = {
  Query: {
    Recipes: async (_: any, args: GetRecipesArgs, context: GraphQlContext) => {
      const objectOffset = args.offset * args.first;
      const foundRecipes = await recipe.find().skip(objectOffset).limit(args.first);
      // const populatedRecipes = await foundRecipes.populate([
      //   { path: "categories", populate: { path: "author" } },
      //   { path: "ingredients.ingredient", populate: { path: "author" } },
      //   { path: "comments" },
      //   { path: "author" },
      // ]);
      return foundRecipes;
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

      let categoriesID = [];
      for (let catIndex in recipeData.categories) {
        let categoryID = await category.findOne({
          name: recipeData.categories[catIndex],
        });
        if (!categoryID) {
          categoryID = await category.create({
            author: userId,
            name: recipeData.categories[catIndex],
            image: "",
            status: "PUBLISHED",
            description: "",
          });
        }
        categoriesID.push(categoryID._id);
      }

      let IngredientsID = [];
      for (let index in recipeData.ingredients) {
        const name = recipeData.ingredients[index].name;
        const id = recipeData.ingredients[index].id;
        let ingredient;
        if (id && mongoose.Types.ObjectId.isValid(id)) {
          ingredient = await ingredients.findById(id);
        } else if (name) {
          ingredient = await ingredients.findOne({ name });
        } else {
          throw new GraphQLError(getText("INGREDIENT_DONT_HAVE_DATA", "EN"));
        }

        if (!ingredient) {
          if (!name) {
            throw new GraphQLError(
              getText("INGREDIENT_NOT_EXISTS_WITH_THIS_ID", "EN")
            );
          }
          try {
            ingredient = await ingredients.create({
              author: userId,
              name,
              image: "",
              description: "",
            });
          } catch (error) {
            throw new GraphQLError(getText("SERVER_ERROR_500", "EN"));
          }
        }
        IngredientsID.push({
          ingredient: ingredient._id,
          quantity: recipeData.ingredients[index].quantity,
        });
      }

      const newRecipe = await recipe.create({
        name: recipeData.name,
        title: recipeData.title,
        description: recipeData.description,
        difficulty: recipeData.difficulty,
        ingredients: [...IngredientsID],
        categories: [...categoriesID],
        steps: [...recipeData.steps],
        status: recipeData.status,
        image: recipeData.image,
        timing: { ...recipeData.timing },
        servings: recipeData.servings,
        likes: {},
        vip: recipeData.vip ? true : false,
        author: userId,
      });
      await user.findByIdAndUpdate(userId, {
        $push: { recipes: newRecipe._id },
      });

      let populatedRecipe = await newRecipe.populate([
        { path: "categories", populate: { path: "author" } },
        { path: "ingredients.ingredient", populate: { path: "author" } },
        { path: "comments" },
        { path: "author" },
      ]);
      return populatedRecipe.toJSON();
    },
  },
};
export default RecipeResolvers;

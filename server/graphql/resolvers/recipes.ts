import { GraphQLError, graphql } from "graphql";
import {
  CreateRecipeArgs,
  GetRecipesArgs,
  GetRecipesByCatArgs,
  GetSingleRecipeByIdArgs,
  GraphQlContext,
  LikeRecipeArgs,
  UpdateRecipeArgs,
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
      const foundRecipes = await recipe
        .find()
        .skip(args.offset)
        .limit(args.first);

      let jsonRecipes = [];
      for (let index in foundRecipes) {
        await foundRecipes[index].populate([
          { path: "categories", populate: { path: "author" } },
          { path: "ingredients.ingredient", populate: { path: "author" } },
          { path: "comments" },
          { path: "author" },
        ]);
        const likedByThisUser = foundRecipes[index].likes.includes(
          context.userData.userId
        );
        const likesCount = foundRecipes[index].likes.length;

        let completeRecipe = {};
        if (foundRecipes[index].vip) {
          completeRecipe = {
            ...foundRecipes[index].toJSON(),
            ingredients: null,
            steps: null,
            likesCount,
            likedByThisUser,
          };
        }else{
          completeRecipe = {
            ...foundRecipes[index].toJSON(),
            likesCount,
            likedByThisUser,
          };
        }
        jsonRecipes.push(completeRecipe);
      }
      return jsonRecipes;
    },

    getSingleRecipeById: async (
      _: any,
      args: GetSingleRecipeByIdArgs,
      context: GraphQlContext
    ) => {
      const foundRecipe = await recipe.findById(args.Id);
      if (!foundRecipe) {
        throw new GraphQLError("Recipe was not found!");
      }
      if (foundRecipe.vip) {
        if (context.userData.role !== "Author") {
          if (!context.userData.isVIP) {
            throw new GraphQLError(
              "You are not authorized to access this recipe!"
            );
          }
        }
      }
      await foundRecipe.populate([
        { path: "categories", populate: { path: "author" } },
        { path: "ingredients.ingredient", populate: { path: "author" } },
        { path: "comments" },
        { path: "author" },
      ]);
      const likedByThisUser = foundRecipe.likes.includes(
        context.userData.userId
      );
      const likesCount = foundRecipe.likes.length;

      return { ...foundRecipe.toJSON(), likedByThisUser, likesCount };
    },

    /**
     *
     * @returns depend on user VIP status or role
     * if user is not authorized for VIP content then only
     * name, title, image and description of that recipe will be sent
     * to client
     */
    getRecipesByCategory: async (
      _: any,
      args: GetRecipesByCatArgs,
      context: GraphQlContext
    ) => {
      let foundRecipes;
      if (context.userData.role !== "Author" && !context.userData.isVIP) {
        foundRecipes = await recipe
          .find()
          .where("categories")
          .equals(args.category)
          .where("vip")
          .equals(false)
          .skip(args.offset)
          .limit(args.first);
        const VIPRecipes = await recipe
          .find()
          .where("vip")
          .equals(true)
          .select(["name", "tite", "image", "description"]);
        let filteredRecipes = [...foundRecipes, ...VIPRecipes];
        return filteredRecipes;
      } else {
        foundRecipes = await recipe
          .where("categories")
          .equals(args.category)
          .skip(args.offset)
          .limit(args.first);
        return foundRecipes;
      }
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
      if (context.userData.role !== "Author") {
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
        likes: [],
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

    updateRecipe: async (
      _: any,
      args: UpdateRecipeArgs,
      context: GraphQlContext
    ) => {
      if (!context.userData || !context.userData.userId) {
        throw new GraphQLError(getText("NOT_AUTHORIZED_MESSAGE", "EN"));
      }
      const { userId } = context.userData;
      if (!mongoose.isValidObjectId(userId)) {
        throw new GraphQLError(getText("NOT_AUTHORIZED_MESSAGE", "EN"));
      }
      if (context.userData.role !== "Author") {
        throw new GraphQLError(getText("NOT_AUTHORIZED_MESSAGE", "EN"));
      }
      let requestedRecipe = await recipe.findByIdAndUpdate(args.id, {
        ...args.recipeData,
      });
      if (!requestedRecipe) {
        throw new GraphQLError("requested recipe was not found!");
      }
      await requestedRecipe.save();

      const updatedRecipe = await recipe.findById(args.id);
      if (!updatedRecipe) {
        throw new GraphQLError("somthing went wrong!");
      }

      return updatedRecipe;
    },

    likeRecipe: async (
      _: any,
      args: LikeRecipeArgs,
      context: GraphQlContext
    ) => {
      if (!context.userData || !context.userData.userId) {
        throw new GraphQLError(getText("NOT_AUTHORIZED_MESSAGE", "EN"));
      }
      const { userId } = context.userData;

      const requestedRecipe = await recipe.findByIdAndUpdate(args.id);
      const requestedUser = await user.findByIdAndUpdate(userId);

      if (!requestedRecipe) {
        throw new GraphQLError(getText("RECIPE_NOT_FOUND", "EN"));
      }
      if (!requestedUser) {
        throw new GraphQLError(getText("NOT_AUTHORIZED_MESSAGE", "EN"));
      }

      if (requestedRecipe.likes) {
        if (
          requestedRecipe.likes.find(
            (id) => id.toString() === userId.toString()
          )
        ) {
          return "success";
        }
      }

      requestedUser?.likes?.push(args.id);
      requestedRecipe.likes?.push(userId);

      try {
        await requestedRecipe.save();
        await requestedUser.save();
      } catch (error) {
        throw new GraphQLError(getText("SERVER_ERROR_500", "EN"));
      }

      return "success";
    },

    unlikeRecipe: async (
      _: any,
      args: LikeRecipeArgs,
      context: GraphQlContext
    ) => {
      if (!context.userData || !context.userData.userId) {
        throw new GraphQLError(getText("NOT_AUTHORIZED_MESSAGE", "EN"));
      }
      const { userId } = context.userData;
      const updateduesr = await user.findByIdAndUpdate(userId, {
        $pull: { likes: args.id.toString() },
      });
      const updatedRecipe = await recipe.findByIdAndUpdate(args.id, {
        $pull: { likes: userId.toString() },
      });

      return "success";
    },
  },
};
export default RecipeResolvers;

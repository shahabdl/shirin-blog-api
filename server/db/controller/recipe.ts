import mongoose from "mongoose";
import recipeModel from "../models/recipe";
import userModel from "../models/user";
import { RecipeArgs, Session } from "../../typedefs/typedef";

interface CreateReciptProps {
  recipeArgs: RecipeArgs;
  session: Session;
}

const getRecipeById = async (id: mongoose.Types.ObjectId) => {
  try {
    if (mongoose.isValidObjectId(id)) {
      let recipe = await recipeModel.findById(id);
      return recipe?.toJSON();
    }
  } catch (err) {
    console.log(err);
  }
};

const getRecipesByPage = async (perPage: number, offset: number) => {
  try {
    let totalRecipes = await recipeModel.collection.countDocuments();
    if (perPage < 1) {
      perPage = 1;
    }
    if (offset < 1) {
      offset = 1;
    }
    let skippingCount = perPage * (offset - 1);
    if (skippingCount > totalRecipes) {
      skippingCount = Math.floor(totalRecipes / perPage) * perPage;
    }
    let Recipes = await recipeModel
      .find({})
      .sort("title")
      .skip(skippingCount)
      .limit(perPage);
    return {
      Recipes,
      pages: Math.ceil(totalRecipes / perPage),
      offset: offset,
    };
  } catch (err) {
    console.log("getRecipesByPage", err);
  }
};

const likeRecipe = async (
  userId: mongoose.Types.ObjectId,
  recipeId: mongoose.Types.ObjectId
) => {
  try {
    let recipe = await recipeModel.findByIdAndUpdate(recipeId);
    if (recipe) {
      for (let user in recipe.likes.likedUsers) {
        if (
          recipe.likes.likedUsers[Number(user)].toString() === userId.toString()
        ) {
          return recipe.toJSON();
        }
      }
      let requestedUser = await userModel.findByIdAndUpdate(userId);
      if (requestedUser) {
        if (recipe.likes.count) {
          recipe.likes.count += 1;
        } else {
          recipe.likes.count = 1;
        }
        recipe.likes.likedUsers.push(
          requestedUser._id as (typeof recipe.likes.likedUsers)[0]
        );
        let duplicate = false;
        for (let key in requestedUser.likes) {
          if (requestedUser.likes[key].toString() === recipeId.toString()) {
            duplicate = true;
            break;
          }
        }
        if (!duplicate) {
          requestedUser.likes.push(recipeId as (typeof requestedUser.likes)[0]);
        }
        recipe.save();
        requestedUser.save();
        return recipe.toJSON();
      }
    }
    return;
  } catch (err) {
    console.log(err);
  }
};

const createRecipe = async ({ recipeArgs, session }: CreateReciptProps) => {
  const {
    image,
    title,
    description,
    difficulty,
    timing,
    servings,
    status,
  } = recipeArgs;
  try {
    const newRecipe = await recipeModel.create({
      title,
      image,
      description,
      difficulty,
      likes: {
        count: 0,
        likedUsers: [],
      },
      timing: {
        preperation: timing.preperation,
        cookTime: timing.cookTime,
        additional: timing.additional,
      },
      servings,
      status,
    });
    newRecipe.save();
    return newRecipe;
  } catch (error) {
    console.log(error);
  }
};
export { getRecipeById, getRecipesByPage, likeRecipe, createRecipe };

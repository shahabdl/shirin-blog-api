import mongoose from "mongoose";
import recipeModel from "../models/recipe";

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
    let skippingCount = perPage * (offset - 1);
    if (skippingCount > totalRecipes) {
      skippingCount = Math.floor(totalRecipes / perPage) * perPage;
    }
    let Recipes = await recipeModel.find({}).sort('title').skip(skippingCount).limit(perPage)

    return {Recipes, pages:Math.ceil(totalRecipes / perPage), offset:offset};
  } catch (err) {
    console.log(err);
  }
};
export { getRecipeById, getRecipesByPage };

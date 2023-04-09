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

export {getRecipeById};
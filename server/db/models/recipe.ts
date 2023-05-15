import mongoose, { Schema } from "mongoose";
import userModel from "./user";

const TimingSchema = new Schema({
  preperation: { type: Number, required: [true, "preperation required"] },
  cookTime: { type: Number, required: [true, "cookTime required"] },
  additional: { type: Number, required: [true, "additional required"] },
});

const LikesSchema = new Schema(
  {
    count: { type: Number },
    likedUsers: [
      {
        type: mongoose.Types.ObjectId,
        ref: userModel,
      },
    ],
  },
  { _id: false }
);

const IngredientSchema = new Schema({
  name: { type: String, required: [true, "ingredient name required"] },
  quantity: { type: String, required: [true, "quantity required"] },
});

const RecipeSchema = new Schema({
  title: { type: String, required: [true, "title required"] },
  image: { type: String, required: [true, "image required"] },
  description: { type: String, required: [true, "description required"] },
  timing: { type: TimingSchema, required: [true, "timing required"] },
  servings: { type: Number, required: [true, "servings required"] },
  difficulty: { type: String, required: [true, "difficulty required"] },
  author: { type: mongoose.Types.ObjectId },
  likes: { type: LikesSchema, required:[true, 'like required']},
  ingredients: [{ type: IngredientSchema}],
  steps: { type: [String]},
});

export default mongoose.model("recipes", RecipeSchema);

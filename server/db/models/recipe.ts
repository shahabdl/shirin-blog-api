import mongoose, { Schema } from "mongoose";

const TimingSchema = new Schema({
  preperation: { type: Number, required: [true, "preperation required"] },
  cookTime: { type: Number, required: [true, "cookTime required"] },
  additional: { type: Number, required: [true, "additional required"] },
});

const LikesSchema = new Schema({
  count: { type: Number, required: [true, "count required"] },
  users: {
    type: [mongoose.Types.ObjectId],
    required: [true, "users required"],
  },
});

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
  author: {
    type: mongoose.Types.ObjectId,
    required: [true, "atuhor required"],
  },
  likes: { type: LikesSchema, required: [true, "likes required"] },
  ingredients: {
    type: IngredientSchema,
    required: [true, "ingredients required"],
  },
  steps: { type: [String], required: [true, "steps required"] },
});


export default mongoose.model("recipes", RecipeSchema);
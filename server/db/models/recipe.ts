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
        ref: "user",
      },
    ],
  },
  { _id: false }
);

const IngredientSchema = new Schema({
  ingredient: {
    type: Schema.Types.ObjectId,
    required: [true, "ingredient is required"],
    ref: "ingredient",
  },
  quantity: { type: String, required: [true, "quantity required"] },
});

const RecipeSchema = new Schema({
  name: { type: String, required: [true, "recipe require name!"] },
  title: { type: String, required: [true, "title required"] },
  creationDate: { type: Date, default: Date.now },
  updateDate: { type: Date, default: Date.now },
  image: { type: String },
  description: { type: String },
  timing: { type: TimingSchema },
  servings: { type: Number },
  difficulty: {
    type: String,
    enum: ["EASY", "MEDIUM", "HARD"],
  },
  status: { type: String, enum: ["PUBLISHED", "DRAFT", "TRASH"] },
  author: { type: mongoose.Types.ObjectId, ref: "user" },
  likes: { type: LikesSchema, required: [true, "like required"] },
  ingredients: { type: [IngredientSchema] },
  steps: { type: [String] },
  comments: { type: [Schema.Types.ObjectId], ref: "comment" },
  categories: { type: [Schema.Types.ObjectId], ref: "category" },
  vip: { type: Boolean },
});
RecipeSchema.set("toJSON", {
  transform: (_, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});
export default mongoose.model("recipe", RecipeSchema);

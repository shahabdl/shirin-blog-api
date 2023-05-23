import mongoose, { Schema } from "mongoose";

const Ingredient = new Schema({
  name: { type: String, required: [true, "category requires a name"] },
  creationDate: { type: Date, default: Date.now },
  updateDate: { type: Date, default: Date.now },
  image: { type: String },
  description: { type: String },
});

export default mongoose.model("ingredient", Ingredient);

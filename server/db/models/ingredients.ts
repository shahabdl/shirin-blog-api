import mongoose, { Schema } from "mongoose";

const Ingredient = new Schema({
  author: { type: Schema.Types.ObjectId, ref: "user" },
  name: { type: String, required: [true, "category requires a name"] },
  creationDate: { type: Date, default: Date.now },
  updateDate: { type: Date, default: Date.now },
  image: { type: String },
  description: { type: String },
});
Ingredient.set("toJSON", {
  transform: (_, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});
export default mongoose.model("ingredient", Ingredient);

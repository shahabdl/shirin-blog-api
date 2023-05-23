import mongoose, { Schema } from "mongoose";

const Category = new Schema({
  name: { type: String, required: [true, "category requires a name"] },
  creationDate: { type: Date, default: Date.now },
  updateDate: { type: Date, default: Date.now },
  image: { type: String },
  description: { type: String },
  status: { type: String, enum: ["PUBLISHED", "DRAFT", "TRASH"] },
});

export default mongoose.model("category",Category);
import mongoose, { Schema } from "mongoose";

const Comment = new Schema({
  author: { type: mongoose.Types.ObjectId, required: [true, "author is required"], ref: 'user' },
  recipe: {
    type: mongoose.Types.ObjectId,
    required: [true, "recipe is required"],
    ref: "recipe",
  },
  creationDate: { type: Date, default: Date.now },
  updateDate: { type: Date, default: Date.now },
  title: { type: String, required: [true, "title is required"] },
  content: { type: String, required: [true, "content is required"] },
  replies: { type: [mongoose.Types.ObjectId], ref: [this] },
});
Comment.set("toJSON", {
  transform: (_, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});
export default mongoose.model("comment", Comment);

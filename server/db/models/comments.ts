import mongoose, { Schema } from "mongoose";

const Comment = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    required: [true, "author is required"],
    ref: "user",
  },
  recipe: {
    type: Schema.Types.ObjectId,
  },
  creationDate: { type: Date, default: Date.now },
  updateDate: { type: Date, default: Date.now },
  title: { type: String, required: [true, "title is required"] },
  content: { type: String, required: [true, "content is required"] },
  replies: { type: [Schema.Types.ObjectId], ref: "comment" },
  replyCount: { type: Number },
  parent: { type: Schema.Types.ObjectId, ref: "comment" },
});
Comment.set("toJSON", {
  transform: (_, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});
export default mongoose.model("comment", Comment);

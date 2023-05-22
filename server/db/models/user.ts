import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
  email: { type: String, required: [true, "need email"] },
  password: { type: String, required: [true, "need email"] },
  name: { type: String },
  username: { type: String },
  image: { type: String },
  signUpAt: { type: Date },
  lastLogin: { type: Date },
  likes: { type: [Schema.Types.ObjectId], ref: "recipe" },
  role: {
    type: String,
    enum: ["user", "author"],
    required: [true, "user should have role"],
  },
  recipes: {type: [Schema.Types.ObjectId], ref: "recipe"}
});

export default mongoose.model("users", UserSchema);

import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
  email: { type: String, required: [true, "need email"] },
  password: { type: String, required: [true, "need email"] },
  name: { type: String },
  username: { type: String },
  image: { type: String },
  signUpAt: { type: Date },
  lastLogin: { type: Date },
  likes: { type: [mongoose.Types.ObjectId], ref: "recipes" },
  role: {
    type: String,
    enum: ["user", "author"],
    required: [true, "user should have role"],
  },
});

export default mongoose.model("users", UserSchema);

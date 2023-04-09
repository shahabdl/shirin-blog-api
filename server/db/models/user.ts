import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
  name: { type: String, required: [true, "user name required"] },
  image: { type: String, required: [true, "user image required"] },
  signUpAt: { type: Date, required: [true, "user signup date required"] },
  lastLogin: { type: Date, required: [true, "user last login date required"] },
  likes: { type: [mongoose.Types.ObjectId], ref: "recipes" },
  role: {
    type: String,
    enum: ["user", "author"],
    required: [true, "user should have role"],
  },
});

export default mongoose.model("users", UserSchema);
import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
  email: { type: String, required: [true, "need email"] },
  password: { type: String, required: [true, "need email"] },
  name: { type: String },
  username: { type: String },
  image: { type: String },
  signUpAt: { type: Date },
  lastLogin: { type: Date },
  isVIP: { type: Boolean, default: false },
  likes: { type: [Schema.Types.ObjectId], ref: "recipe" },
  role: {
    type: String,
    enum: ["User", "Author"],
    required: [true, "user should have role"],
  },
  recipes: { type: [Schema.Types.ObjectId], ref: "recipe" },
});
UserSchema.set("toJSON", {
  transform: (_, ret) => {
    ret.id = ret._id;
    delete ret.__v;
  },
});
export default mongoose.model("user", UserSchema);

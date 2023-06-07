import mongoose, { Schema } from "mongoose";

const GridViewSchema = new Schema({
  page: { type: String, unique: true },
  structureLarge: { type: [[String]] },
  structureMedium: { type: [[String]] },
  structureSmall: { type: [[String]] },
  structureMobile: { type: [[String]] },
});
GridViewSchema.set("toJSON", {
  transform: (_, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});
export default mongoose.model("gridView", GridViewSchema);

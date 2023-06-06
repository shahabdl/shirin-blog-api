import mongoose, { Schema } from "mongoose";

const SlideSchema = new Schema(
  {
    title: { type: String },
    description: { type: String },
    image: { type: String },
  },
  { _id: false }
);

const SliderSchema = new Schema({
  page: { type: String, unique: true },
  slide: { type: [SlideSchema] },
});

SliderSchema.set("toJSON", {
    transform: (_, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    },
  });

export default mongoose.model("slider", SliderSchema);

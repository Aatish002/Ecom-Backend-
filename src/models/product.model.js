import mongoose from "mongoose";
const categories = ["shoes", "torso", "leg"];

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    imagePublicId: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number,
    },
    Categories: {
      type: String,
      enum: categories,
    },
    inStock: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true },
);

export const Product = mongoose.model("Product", productSchema);

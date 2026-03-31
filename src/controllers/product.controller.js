import { Product } from "../models/product.model.js";
import { uploadToCloudinary } from "../../utils/cloudinary.utils.js";
import { json } from "express";

//Alogrithm for adding product
//take the input from req.body {name, description,image,price,categories}
//if something is missing so errro it is required
//check whether the product is already available or not
//save the product in db
//query the saved product
//send success response

export const addProduct = async (req, res) => {
  try {
    const { name, description, image, price, categories } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }
    const uploadResult = await uploadToCloudinary(
      req.file.buffer,
      "profilePic",
    );
    console.log(uploadResult, "upload result");
    const product = await Product.create({
      name,
      description,
      price,
      categories,
      image: uploadResult.secure_url,
      imagePublicId: uploadResult.public_id,
    });
    if (!product) {
      return res
        .status(500)
        .json({ message: "something went wrong while creating product" });
    }
    return res
      .status(200)
      .json({ message: "product created successfully", data: product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Algorithm for deleting product
//check if the user is logged in or not
//check if the product exist or not
//delete the product from db
//send success response

export const removeProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: "product not found " });
    }

    res.status(200).json({ message: "product removed successfully " });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

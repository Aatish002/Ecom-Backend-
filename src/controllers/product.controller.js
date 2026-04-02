import { Product } from "../models/product.model.js";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../../utils/cloudinary.utils.js";

//Alogrithm for adding product
//take the input from req.body {name, description,image,price,categories}
//if something is missing so errro it is required
//check whether the product is already available or not
//save the product in db
//query the saved product
//send success response

export const addProduct = async (req, res) => {
  try {
    const { name, description, image, price, Categories } = req.body;
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
      Categories,
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

export const removeOneProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "product not found " });
    }
    if (product.imagePublicId) {
      await deleteFromCloudinary(product.imagePublicId);
    }
    await product.deleteOne();

    return res.status(200).json({ message: "product removed successfully " });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Algorithm for getting product
//check whether the product exist or not
//if exist fetch the product from db
//query the fetched product to user
//send success response

export const fetchProductOne = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found!" });
    }
    return res
      .status(200)
      .json({ message: "product fetched successfully ", data: product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Algorithm for changing product ingormation
//check if the user is logged in or no
//check if the product exist or not
//take the details from user
//update the details and save in db
//query the saved product
//send success response

export const updateOneProduct = async (req, res) => {
  try {
    const { name, description, price, categories } = req.body;
    const productId = req.params.id;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "product does not exist!" });
    }

    let updateData = {
      name,
      description,
      price,
      categories,
    };

    if (req.file) {
      if (product.imagePublicId) {
        await deleteFromCloudinary(product.imagePublicId);
      }

      const uploadResult = await uploadToCloudinary(
        req.file.buffer,
        "profilePic",
      );

      updateData.image = uploadResult.secure_url;
      updateData.imagePublicId = uploadResult.public_id;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateData,
      { new: true },
    );

    res.status(200).json({
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Algorithm for fetching multiple products
//

export const fetchProduct = async (req, res) => {
  try {
    let perPage = parseInt(req.query.perPage) || 5;
    let page = parseInt(req.query.page) || 1;
    let categoryFromUrl = req.query.category;
    let productFilter = {};
    if (categoryFromUrl) {
      productFilter.Categories = categoryFromUrl;
    }
    const products = await Product.find(productFilter)
      .skip((page - 1) * perPage)
      .limit(perPage);

    const totalItems = await Product.countDocuments(productFilter);
    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        currentPage: page,
        perPage: perPage,
        totalItems: totalItems,
        totalPages: Math.ceil(totalItems / perPage),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

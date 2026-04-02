import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../../utils/cloudinary.utils.js";
import { User } from "../models/user.model.js";

const generateAccessAndRefreshToken = async (user) => {
  try {
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save();
    return { accessToken, refreshToken };
  } catch (error) {
    console.log("Error while generating access and refresh token", error);
  }
};

// Algorithm for User Register
// 1. Take data from user (email,username,password,phone no)
// 2. Check if user already exist by email
// 3. Save the user in db
// 4, Query the saved user from db and remove sensitive fields
// 5. Send success response

export const register = async function (req, res) {
  try {
    const { userName, email, phoneNo, password } = req.body;
    const isExist = await User.findOne({ email });
    if (isExist) {
      return res.status(400).json({ message: "User already exist" });
    }

    const user = await User.create({
      email,
      userName,
      phoneNo,
      password,
    });

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken",
    );
    res.status(201).json({
      message: "User created successfully",
      data: createdUser,
    });
  } catch (error) {
    console.log("ERROR WHILE REGISTERING", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// Algorithm for user login
// 1. Take user input from req.body (email,password)
// 2. Query the user from email and check if it exists
// 3. Check if the password is correct
// 4. Generate access token and refresh token and save refresh token in user db
// 5. Query the loggend in user and remove sensetive information
// 6. Save the token in cookie and send success response

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "User Not Found" });
    }
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      res.status(400).json({ message: "Invalid Credentials" });
    }

    const { refreshToken, accessToken } =
      await generateAccessAndRefreshToken(user);
    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken",
    );
    const options = {
      httpOnly: false,
      secure: false,
    };

    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        message: "LoggedIn successfully",
        data: loggedInUser,
        accessToken,
        refreshToken,
      });
  } catch (error) {
    console.log("Error while logging in:", error);
    res.status(500).json({ message: error.message });
  }
};

export const curretUser = async (req, res) => {
  try {
    res
      .status(200)
      .json({ message: "logged in user fetched successfully", data: req.user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//Algorithm for user log out
//check user logged in
//remove the refresh token from db
//clear the access token and refresh token in cookie

export const logout = async (req, res) => {
  try {
    req.user.refreshToken = undefined;
    await req.user.save();
    const options = {
      httpOnly: false,
      secure: false,
    };
    res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json({ message: "User logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Algorithm for changing password
//check if user is logged in
//take the old password and new password from the client (req.body)
//check if both fields are provided
//check if old password is correct
//replace old password with new password

export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        message: "Both old and new password are required",
      });
    }
    const isPasswordValid = await req.user.isPasswordCorrect(oldPassword);
    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }
    req.user.password = newPassword;
    await req.user.save();

    res.status(200).json({
      message: "Password change successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// Algorithm for changing userName
// check whether the user is logged in or not
// if logged in take the req from req.body
// check whether username already exist or not
// if not change the username and save in db
// query the user and sed success response
export const changeUsername = async (req, res) => {
  try {
    const { userName, phoneNo } = req.body;
    const userId = req.user._id;
    const isExist = await User.findOne({ userName });
    if (isExist) {
      return res.status(400).json({ message: "User name already exist!" });
    }
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { userName, phoneNo },

      { new: true },
    ).select("-password -refreshToken");
    res
      .status(200)
      .json(
        { message: "Username changed successfully!" },
        { data: updatedUser },
      );
  } catch (error) {
    console.log("Error while changing username", error);
    res.status(500).json({ message: error.message });
  }
};

// export const updateProfilePic = async (req, res) => {
//   try {
//     if (!req.file) return res.status(400).json({ message: "No file uploaded" });
//     const user = await User.findByIdAndUpdate(
//       req.user._id,
//       {
//         profilePic: `public/uploads${req.file.filename}`,
//       },
//       { new: true },
//     ).select("-password -refreshToken");
//     res
//       .status(200)
//       .json(
//         { message: "Profile picture updated successfully" },
//         { data: user },
//       );
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

export const updateProfilePic = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    console.log("req.fil buffer", req.file.buffer);
    console.log(req.user.profilePicPublicId);
    if (req.user.profilePicPublicId) {
      await deleteFromCloudinary(req.user.profilePicPublicId);
    }
    const profilePicUrl = await uploadToCloudinary(
      req.file.buffer,
      "profilePic",
    );
    console.log(profilePicUrl);
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        profilePic: profilePicUrl.secure_url,
        profilePicPublicId: profilePicUrl.public_id,
      },

      { new: true },
    ).select("-password -refreshToken");
    if (!user) {
      return res.status(404).json({ message: "User not found " });
    }
    res
      .status(200)
      .json(
        { message: "Profile picture updated successfully" },
        { data: user },
      );
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: error.message });
  }
};

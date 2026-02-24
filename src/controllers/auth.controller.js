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
      message: error,
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
    res.status(500).json({ message: error });
  }
};

import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

// Algorithm to check logged in user
// 1. Accept (access)token from req in cookies or authorization header
// 2. if no token return with status 401
// 3. Decode the token
// 4. Query the user by their id and remove the sensitive information
// 5. Req bhitra user lai rakahdine
// 6. next()

export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    const token =
      req.cookies.accessToken ||
      (authHeader && authHeader.replace("Bearer ", ""));
    if (!token) {
      return res.status(401).json({ message: "Unauthorized access" });
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken._id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log("Error while verifying user", error);
    res.status(500).json({ message: error });
  }
};

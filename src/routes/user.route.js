import { Router } from "express";
import {
  changePassword,
  changeUsername,
  curretUser,
  logout,
  register,
  updateProfilePic,
  userLogin,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { validateRequest } from "../middleware/validation.middleware.js";
import { registerValidationSchema } from "../configs/validationSchema.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

router
  .route("/register")
  .post(validateRequest(registerValidationSchema), register);
router.route("/login").post(userLogin);
router.route("/me").get(verifyToken, curretUser);
router.route("/logout").patch(verifyToken, logout);
router.route("/change-password").patch(verifyToken, changePassword);
router.route("/change-user-name").patch(verifyToken, changeUsername);
router
  .route("/profile-pic")
  .patch(verifyToken, upload.single("profilePic"), updateProfilePic);

export default router;

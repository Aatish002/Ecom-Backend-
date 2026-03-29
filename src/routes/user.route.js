import { Router } from "express";
import {
  changeUsername,
  curretUser,
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
router.route("/me/changeUserName").patch(verifyToken, changeUsername);
router
  .route("/me/profilePic")
  .patch(verifyToken, upload.single("profilePic"), updateProfilePic);

export default router;

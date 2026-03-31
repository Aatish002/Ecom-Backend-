import { Router } from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import {
  addProduct,
  removeProduct,
} from "../controllers/product.controller.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

router
  .route("/add-product")
  .post(verifyToken, upload.single("image"), addProduct);
router.route("/:id").delete(verifyToken, removeProduct);

export default router;

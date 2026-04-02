import { Router } from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import {
  addProduct,
  fetchProduct,
  fetchProductOne,
  removeOneProduct,
  updateOneProduct,
} from "../controllers/product.controller.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

router
  .route("/add-product")
  .post(verifyToken, upload.single("image"), addProduct);
router.route("/:id").delete(verifyToken, removeOneProduct);
router.route("/:id").get(fetchProductOne);
router
  .route("/update-product/:id")
  .patch(verifyToken, upload.single("image"), updateOneProduct);
router.route("/").get(fetchProduct);

export default router;

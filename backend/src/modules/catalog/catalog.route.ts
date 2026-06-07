import { Router } from "express";
import { createCategory, deleteCategory, getCategories, getCategory, updateCategory } from "./controllers/category.controller.js";
import { createProduct, deleteProduct, getProduct, getProducts, updateProduct } from "./controllers/product.controller.js";
import { uploadImages, deleteImage, togglePrimary } from "./controllers/image.controller.js";
import { createVariant, deleteVariant, getVariant, getVariantsByProduct, updateVariant } from "./controllers/variant.controller.js";
import { upload } from "../../shared/middlewares/multer.middleware.js";

const router = Router();

// Category routes
router.post("/category", createCategory);
router.get("/category", getCategories);
router.get("/category/:id", getCategory);
router.put("/category/:id", updateCategory);
router.delete("/category/:id", deleteCategory);

// Product routes
router.post("/product", createProduct);
router.get("/product", getProducts);
router.get("/product/:id", getProduct);
router.put("/product/:id", updateProduct);
router.delete("/product/:id", deleteProduct);

// Image management routes
router.post("/product/:productId/images", upload.array("images", 10), uploadImages);
router.delete("/image/:id", deleteImage);
router.put("/image/:id/primary", togglePrimary);

// Product Variant routes
router.post("/product/:productId/variants", createVariant);
router.get("/product/:productId/variants", getVariantsByProduct);
router.get("/variant/:id", getVariant);
router.put("/variant/:id", updateVariant);
router.delete("/variant/:id", deleteVariant);

export default router;

import { Router } from "express";
import { createCategory, deleteCategory, getCategories, getCategory, updateCategory } from "./controllers/category.controller.js";

const router = Router();

// Category routes
router.post("/category", createCategory);
router.get("/category", getCategories);
router.get("/category/:id", getCategory);
router.put("/category/:id", updateCategory);
router.delete("/category/:id", deleteCategory);

// Product routes (To be implemented)
// router.post("/product", createProduct);
// router.get("/product", getProducts);
// router.get("/product/:id", getProduct);
// router.put("/product/:id", updateProduct);
// router.delete("/product/:id", deleteProduct);

export default router;
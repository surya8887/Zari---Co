import { Router } from "express";
import * as userController from "./user.controller.js";
import { authenticateUser, authenticateAdmin } from "../../shared/middlewares/auth.middleware.js";

const router: Router = Router();

// @route GET /api/v1/users
// @desc Get all users (Admin only)
router.get("/", authenticateUser, authenticateAdmin, userController.getAllUsers);

// @route GET /api/v1/users/:id
// @desc Get single user
router.get("/:id", authenticateUser, userController.getUserById);

export default router;

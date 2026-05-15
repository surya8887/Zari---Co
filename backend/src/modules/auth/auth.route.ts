import { Router } from "express";
import { registerUser, loginUser, logoutUser } from "./auth.controller.js";
import { authenticateUser } from "../../shared/middlewares/auth.middleware.js";

const router: Router = Router();

// public routes
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
// private routes
router.route("/logout").get(authenticateUser, logoutUser);

export default router;
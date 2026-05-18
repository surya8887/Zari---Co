import { Router } from "express";
import * as orderController from "./order.controller.js";
import { authenticateUser } from "../../shared/middlewares/auth.middleware.js";

const router: Router = Router();

// Both placing an order and listing orders require an authenticated user
router.post("/", authenticateUser, orderController.createOrder);
router.get("/", authenticateUser, orderController.getUserOrders);

export default router;

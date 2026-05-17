import { Router } from "express";
import {
  createInventory,
  deleteInventory,
  getInventory,
  getInventoryList,
  updateInventory,
} from "./controllers/inventor.controller.js";

const router = Router();

router.post("/", createInventory);
router.get("/", getInventoryList);
router.get("/:id", getInventory);
router.put("/:id", updateInventory);
router.delete("/:id", deleteInventory);

export default router;

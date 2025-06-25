import express from "express";
import { handleGetCategoryByName } from "../controllers/categoryController.js";

const router = express.Router();
// Esto es un comentario
router.get("/get_by_name/:name", handleGetCategoryByName);

export default router;

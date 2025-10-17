import express from "express";
import { generateInvoicePDF } from "../controllers/pdfController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/:id/pdf", protect, generateInvoicePDF);

export default router;
import express from "express";
import { sendInvoiceEmail } from "../controllers/emailController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/:id/send", protect, sendInvoiceEmail);

export default router;
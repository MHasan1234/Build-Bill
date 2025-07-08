import express from "express";

import {
  createInvoice,
  getAllInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
  sendInvoiceEmail,
  markAsPaid,
  markAsUnpaid,
  generateInvoicePDF,
    getAllInvoicesAdmin 
} from "../controllers/InvoiceController.js";

import { protect,  requireRole } from "../middleware/auth.js";


const router = express.Router();


router.post("/",  protect,  createInvoice);
router.get("/", protect,  getAllInvoices);
router.get("/all-invoices", protect, requireRole("admin"), getAllInvoicesAdmin);

router.get("/:id", protect,  getInvoiceById);

router.put("/:id", protect, updateInvoice);

router.delete("/:id", protect,  deleteInvoice);
router.post("/:id/send", protect, sendInvoiceEmail);
router.put("/:id/status", protect, markAsPaid);
router.put("/:id/status/unpaid", protect, markAsUnpaid);

router.get("/:id/pdf", protect, generateInvoicePDF);



export default router;
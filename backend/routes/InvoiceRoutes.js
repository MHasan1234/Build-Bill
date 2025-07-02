import express from "express";

import {
  createInvoice,
  getAllInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
  sendInvoiceEmail,
  markAsPaid,
  markAsUnpaid
} from "../controllers/InvoiceController.js";

import { protect } from "../middleware/auth.js";


const router = express.Router();


router.post("/",  protect,  createInvoice);
router.get("/", protect,  getAllInvoices);
router.get("/:id", protect,  getInvoiceById);

router.put("/:id", protect, updateInvoice);

router.delete("/:id", protect,  deleteInvoice);
router.post("/:id/send", protect, sendInvoiceEmail);
router.put("/:id/status", protect, markAsPaid);
router.put("/:id/status/unpaid", protect, markAsUnpaid);


export default router;
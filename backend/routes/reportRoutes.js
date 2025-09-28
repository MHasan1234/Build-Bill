import express from 'express';
import {
    getAllInvoicesForReport,
    getRevenueSummary,
    exportInvoicesToCSV
} from '../controllers/reportController.js';
import { protect, requireRole } from '../middleware/auth.js';

const router = express.Router();


const requireAccountantOrAdmin = (req, res, next) => {
    if (req.user && (req.user.role === 'accountant' || req.user.role === 'admin')) {
        return next();
    } else {
        return res.status(403).json({ message: "Access denied" });
    }
};

router.use(protect, requireAccountantOrAdmin);

router.get('/invoices', getAllInvoicesForReport);
router.post('/revenue-summary', getRevenueSummary);
router.get('/export/invoices-csv', exportInvoicesToCSV);

export default router;
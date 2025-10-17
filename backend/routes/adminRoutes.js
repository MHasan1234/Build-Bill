import express from 'express';
import { getAllUsers, getUserById, updateUserRole, deleteUser, getSiteAnalytics, getAllInvoicesAdmin } from '../controllers/adminController.js';
import { protect, requireRole } from '../middleware/auth.js';

const router = express.Router();


router.use(protect, requireRole('admin'));

router.get('/analytics/summary', getSiteAnalytics);
router.get('/invoices', getAllInvoicesAdmin);
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

export default router;
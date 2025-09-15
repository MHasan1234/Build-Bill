import express from 'express';
import { getAllUsers, getUserById, updateUserRole, deleteUser, getSiteAnalytics } from '../controllers/userController.js';
import { protect, requireRole } from '../middleware/auth.js';

const router = express.Router();


router.use(protect, requireRole('admin'));

router.get('/analytics/summary', getSiteAnalytics);

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id/role', updateUserRole);
router.delete('/:id', deleteUser);

export default router;
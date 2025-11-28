import express from 'express';
import { adminLogin, getAllUsers, deleteUser, getAllInvitations, deleteInvitationAdmin, getDashboardStats } from '../controllers/adminController.js';
import { authenticateAdmin } from '../middleware/adminAuth.js';

const router = express.Router();

router.post('/login', adminLogin);

router.get('/stats', authenticateAdmin, getDashboardStats);
router.get('/users', authenticateAdmin, getAllUsers);
router.delete('/users/:id', authenticateAdmin, deleteUser);
router.get('/invitations', authenticateAdmin, getAllInvitations);
router.delete('/invitations/:id', authenticateAdmin, deleteInvitationAdmin);

export default router;

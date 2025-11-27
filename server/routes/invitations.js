import { Router } from 'express';
import {
  getInvitations,
  getInvitation,
  createInvitation,
  updateInvitation,
  deleteInvitation,
  publishInvitation,
  getAnalytics,
} from '../controllers/invitationController.js';
import { authenticateToken } from '../middleware/auth.js';
import { validateInvitation, handleValidationErrors } from '../middleware/validation.js';

const router = Router();

router.use(authenticateToken);

router.get('/', getInvitations);
router.get('/:id', getInvitation);
router.post('/', validateInvitation, handleValidationErrors, createInvitation);
router.put('/:id', updateInvitation);
router.delete('/:id', deleteInvitation);
router.post('/:id/publish', publishInvitation);
router.get('/:id/analytics', getAnalytics);

export default router;

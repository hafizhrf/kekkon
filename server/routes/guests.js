import { Router } from 'express';
import {
  getGuests,
  addGuest,
  bulkAddGuests,
  updateGuest,
  deleteGuest,
} from '../controllers/guestController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);

router.get('/invitations/:id/guests', getGuests);
router.post('/invitations/:id/guests', addGuest);
router.post('/invitations/:id/guests/bulk', bulkAddGuests);
router.put('/guests/:id', updateGuest);
router.delete('/guests/:id', deleteGuest);

export default router;

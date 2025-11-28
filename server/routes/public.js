import { Router } from 'express';
import { getPublicInvitation, getOGImage } from '../controllers/invitationController.js';
import { submitRSVP, getMessages } from '../controllers/guestController.js';
import { validateRSVP, handleValidationErrors } from '../middleware/validation.js';

const router = Router();

router.get('/:slug/og-image', getOGImage);
router.get('/:slug', getPublicInvitation);
router.post('/:slug/rsvp', validateRSVP, handleValidationErrors, submitRSVP);
router.get('/:slug/messages', getMessages);

export default router;

import { Router } from 'express';
import { uploadImage, uploadMusic, handleImageUpload, handleMusicUpload } from '../controllers/uploadController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);

router.post('/image', uploadImage, handleImageUpload);
router.post('/music', uploadMusic, handleMusicUpload);

export default router;

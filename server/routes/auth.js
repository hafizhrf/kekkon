import { Router } from 'express';
import { register, login, getProfile } from '../controllers/authController.js';
import { validateRegister, validateLogin, handleValidationErrors, checkSqlInjection } from '../middleware/validation.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Apply SQL injection check to all auth routes
router.use(checkSqlInjection);

router.post('/register', validateRegister, handleValidationErrors, register);
router.post('/login', validateLogin, handleValidationErrors, login);
router.get('/profile', authenticateToken, getProfile);

export default router;

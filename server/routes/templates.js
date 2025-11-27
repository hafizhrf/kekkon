import { Router } from 'express';
import { getTemplates, getTemplate } from '../controllers/templateController.js';

const router = Router();

router.get('/', getTemplates);
router.get('/:id', getTemplate);

export default router;

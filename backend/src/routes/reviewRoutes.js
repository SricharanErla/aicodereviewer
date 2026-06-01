import { Router } from 'express';
import { reviewCode } from '../controllers/reviewController.js';

const router = Router();

router.post('/review', reviewCode);

export default router;

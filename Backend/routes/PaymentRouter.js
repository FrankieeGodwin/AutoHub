import { createPayment } from '../controllers/PaymentController.js';

import express from 'express';
const router = express.Router();

router.post('/create', createPayment);

export default router;
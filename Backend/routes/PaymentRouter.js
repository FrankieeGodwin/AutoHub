import { createPayment, AllPaymentsByUserId, AllpaymentsForAdmin, PaymentMonthlySummary } from '../controllers/PaymentController.js';

import express from 'express';
const router = express.Router();

router.post("/create", createPayment);
router.get("/payments/:userId", AllPaymentsByUserId);
router.get("/Admin",AllpaymentsForAdmin);
router.get("/Admin/monthly",PaymentMonthlySummary);

export default router;
import express from 'express';
import { createCar , deleteCar } from '../controllers/CarController.js';
const router = express.Router();

router.post('/',createCar);
router.delete('/:id',deleteCar);

export default router;

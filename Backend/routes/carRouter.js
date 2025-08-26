import express from 'express';
import { createCar , deleteCar , getAllCars } from '../controllers/CarController.js';
const router = express.Router();

router.post('/',createCar);
router.get('/',getAllCars);
router.delete('/:id',deleteCar);

export default router;

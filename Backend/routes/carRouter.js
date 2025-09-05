import express from 'express';
import { createCar , deleteCar , getAllCars, getCarById } from '../controllers/CarController.js';
import { getFeaturesByCarId } from '../controllers/FeaturesController.js';
import { getCarDetailsByCarId } from '../controllers/CarDetailsController.js';
import { getImagesByCarId } from '../controllers/ImagesController.js';
import { getLocationByCarId } from '../controllers/LocationController.js';
const router = express.Router();

router.post('/',createCar);
router.get('/',getAllCars);
router.get('/main/:id',getCarById);
router.get('/features/:id',getFeaturesByCarId);
router.get('/details/:id',getCarDetailsByCarId);
router.get('/images/:id',getImagesByCarId);
router.get('/location/:id',getLocationByCarId);
router.delete('/:id',deleteCar);

export default router;

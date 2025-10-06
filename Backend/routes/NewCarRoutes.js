import express from "express";
import { uploadCSV , getDealerCars, getAllCars } from "../controllers/NewCarController.js";

const router = express.Router();

// Route for CSV upload
router.post("/upload-newcars/:dealerId", uploadCSV);
router.get("/dealer-cars/:dealerId", getDealerCars);
router.get("/all-cars", getAllCars);
export default router;

import express from "express";
import { uploadCSV , getDealerCars } from "../controllers/NewCarController.js";

const router = express.Router();

// Route for CSV upload
router.post("/upload-newcars/:dealerId", uploadCSV);
router.get("/dealer-cars/:dealerId", getDealerCars);
export default router;

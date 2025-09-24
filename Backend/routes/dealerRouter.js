import express from 'express';
import { createDealer , deleteDealer } from "../controllers/DealerController.js";
const router = express.Router();

router.post("/",createDealer);
router.delete("/:dealerId",deleteDealer);
export default router;
import express from 'express';
import { createDealer , deleteDealer , dealerLogin , getAllDealers} from "../controllers/DealerController.js";
import dealerAuthMiddleware from '../middleware/dealerAuthMiddleware.js';
const router = express.Router();

router.post("/",createDealer);
router.delete("/:dealerId",dealerAuthMiddleware,deleteDealer);
router.post("/dealerLogin",dealerLogin);
router.get("/",dealerAuthMiddleware,getAllDealers);
export default router;
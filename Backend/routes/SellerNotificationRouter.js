import express from "express";
import {addSellerInformationNotification,
    getSellerInformationNotificationByBuyerId,
    checkSellerNotification,
    checkview,
    markAsViewed
} from "../controllers/SellerInformationNotificationController.js";

const router = express.Router();

router.post("/",addSellerInformationNotification);
router.get("/:id",getSellerInformationNotificationByBuyerId);
router.get("/check/:buyerId/:carId",checkSellerNotification);
router.get("/checkview/:userId",checkview);
router.put("/markAsViewed/:userId",markAsViewed);

export default router;
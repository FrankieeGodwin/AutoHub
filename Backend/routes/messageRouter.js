import { createMessage , getChatPartners , getMessagesBetweenUsers , deleteMessage} from "../controllers/messageController.js";
import express from  "express";

const router=express.Router();

router.post("/send",createMessage);
router.get("/getChatPartners/:userId",getChatPartners);
router.get("/getMessagesBetween/:userId/:partnerId", getMessagesBetweenUsers);
router.delete("/deleteMessage/:messageId",deleteMessage);

export default router;
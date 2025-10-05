import {
  createChat,
  getUserChats,
  getChatById,
  sendMessage,
} from "../controllers/ChatController.js";

import express from "express";

const router = express.Router();

router.post("/", createChat);
router.get("/:userId", getUserChats);
router.get("/:chatId", getChatById);
router.post("/:chatId/message", sendMessage);

export default router;
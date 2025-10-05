// controllers/ChatController.js
import Chat from "../models/Chat.model.js";

// Create a new chat or return existing chat
export const createChat = async (req, res) => {
  const { user1, user2 } = req.body;

  if (!user1 || !user2) {
    return res.status(400).json({ error: "Both user1 and user2 are required" });
  }

  try {
    const participants = [user1, user2].sort();
    let chat = await Chat.findOne({ participants: { $all: participants, $size:2 } });

    if (!chat) {
      chat = await Chat.create({ participants, messages: [] });
    }

    res.status(201).json(chat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all chats of a user
export const getUserChats = async (req, res) => {
  const { userId } = req.params;

  try {
    const chats = await Chat.find({ participants: userId })
      .populate("participants", "name email phone")
      .sort({ lastUpdated: -1 });

    res.status(200).json(chats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a chat by chatId
export const getChatById = async (req, res) => {
  const { chatId } = req.params;

  try {
    const chat = await Chat.findById(chatId).populate("participants", "name email phone");
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    res.status(200).json(chat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Send a message
export const sendMessage = async (req, res) => {
  const { chatId } = req.params;
  const { senderId, text } = req.body;
  try {
    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    chat.messages.push({ sender: senderId, text });
    chat.lastUpdated = Date.now();
    await chat.save();

    res.status(201).json(chat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

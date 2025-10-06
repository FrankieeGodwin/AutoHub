import Message from "../models/Message.model.js";

export const createMessage = async (req, res) => {
  try {
    const { sender, receiver, text } = req.body;
    if (!sender || !receiver || !text)
      return res.status(400).json({ message: "All fields are required" });

    const newMessage = await Message.create({ sender, receiver, text });

    res.status(201).json({ message: "Message stored successfully", data: newMessage });
  } catch (error) {
    console.error("Error creating message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getChatPartners = async (req, res) => {
  try {
    const { userId } = req.params;

    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }],
    });

    const partners = [
      ...new Set(
        messages.map((msg) =>
          msg.sender.toString() === userId
            ? msg.receiver.toString()
            : msg.sender.toString()
        )
      ),
    ];

    res.status(200).json({ partners });
  } catch (error) {
    console.error("Error fetching chat partners:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMessagesBetweenUsers = async (req, res) => {
  try {
    const { userId, partnerId } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: partnerId },
        { sender: partnerId, receiver: userId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json({ messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// --- Delete a message by messageId ---
export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Delete the message
    await message.remove();

    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


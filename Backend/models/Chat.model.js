import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  participants: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  ], // buyer and seller
  messages: [
    {
      sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      text: { type: String },
      createdAt: { type: Date, default: Date.now },
    }
  ],
  lastUpdated: { type: Date, default: Date.now },
});

export default mongoose.model("Chat", chatSchema);

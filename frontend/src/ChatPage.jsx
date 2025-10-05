import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";

function ChatPage() {
  const { sellerId } = useParams();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const userId = user?.userId;
  const token = user?.token;
  const API_BASE = import.meta.env.VITE_API_BASE;
  const navigate = useNavigate();
  console.log(sellerId);
  console.log(userId);
  const [chat, setChat] = useState(null);
  const fetchRef = useRef(false);
  useEffect(() => {
    if (!sellerId || fetchRef.current) return;
    const fetchOrCreateChat = async () => {
      try {
        const res = await axios.post(
          `${API_BASE}/chats`,
          { user1: userId, user2: sellerId }, 
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setChat(res.data);
        fetchRef.current = true;
      } catch (err) {
        console.error("Error fetching/creating chat:", err);
      }
    };

    if (sellerId) fetchOrCreateChat();
  }, [sellerId]);

  if (!chat) return <p>Loading chat...</p>;

  return (
    <div className="min-h-screen p-4">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
      >
        ← Back
      </button>

      <h2 className="text-xl font-bold mb-4">Chat with Seller</h2>

      {chat.messages.map((msg, index) => (
        <div
          key={index}
          className={`my-2 ${msg.sender === userId ? "text-right" : "text-left"}`}
        >
          <p className="inline-block px-3 py-2 rounded-lg bg-gray-200">{msg.text}</p>
        </div>
      ))}
    </div>
  );
}

export default ChatPage;

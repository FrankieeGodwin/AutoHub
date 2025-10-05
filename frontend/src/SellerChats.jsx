import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function SellerChats() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const sellerId = user?.userId;
  const token = user?.token;
  const API_BASE = import.meta.env.VITE_API_BASE;

  const [chats, setChats] = useState([]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await axios.get(`${API_BASE}/chats/${sellerId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setChats(res.data);
      } catch (err) {
        console.error("Error fetching chats:", err);
      }
    };
    if (sellerId) fetchChats();
  }, [sellerId]);

  return (
    <div className="min-h-screen p-4">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
      >
        ← Back
      </button>

      <h2 className="text-xl font-bold mb-4">All Chats</h2>
      <div className="space-y-2">
        {chats.map((chat) => (
          <div
            key={chat._id}
            className="p-3 bg-white rounded shadow cursor-pointer hover:bg-purple-50"
            onClick={() => navigate(`/chat/${chat.participants.find(p => p !== sellerId)}`)}
          >
            Chat with User: {chat.participants.find(p => p !== sellerId)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SellerChats;

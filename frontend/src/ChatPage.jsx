import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";
const user=JSON.parse(localStorage.getItem("user"));
const currentUserId = user?.userId; // example current user ID

const ChatPage = () => {
  const [partners, setPartners] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // --- Fetch chat partners ---
  const fetchPartners = async () => {
    try {
      const res = await axios.get(`${API_BASE}/messages/getChatPartners/${currentUserId}`);
      setPartners(res.data.partners);
    } catch (err) {
      console.error(err);
    }
  };

  // --- Fetch messages between current user and selected partner ---
  const fetchMessages = async (partnerId) => {
    try {
      const res = await axios.get(`${API_BASE}/messages/getMessagesBetween/${currentUserId}/${partnerId}`);
      setMessages(res.data.messages);
    } catch (err) {
      console.error(err);
    }
  };

  // --- Send a new message ---
  const sendMessage = async () => {
    if (!newMessage || !selectedPartner) return;

    try {
      // Normally encrypt here on frontend before sending
      await axios.post(`${API_BASE}/messages/send`, {
        sender: currentUserId,
        receiver: selectedPartner,
        text: newMessage
      });

      setNewMessage("");
      fetchMessages(selectedPartner); // refresh messages
    } catch (err) {
      console.error(err);
    }
  };

  // --- Select a partner ---
  const selectPartner = (partnerId) => {
    setSelectedPartner(partnerId);
    fetchMessages(partnerId);
  };

  // --- Polling for new messages every second ---
  useEffect(() => {
    fetchPartners();
    const interval = setInterval(() => {
      if (selectedPartner) fetchMessages(selectedPartner);
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedPartner]);

  return (
    <div style={{ display: "flex", height: "80vh", border: "1px solid #ccc" }}>
      {/* Chat Partners */}
      <div style={{ width: "25%", borderRight: "1px solid #ccc", overflowY: "auto" }}>
        <h3 style={{ textAlign: "center" }}>Chat Partners</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {partners.map((partner) => (
            <li
              key={partner}
              style={{
                padding: "10px",
                cursor: "pointer",
                backgroundColor: selectedPartner === partner ? "#e0e0e0" : "white"
              }}
              onClick={() => selectPartner(partner)}
            >
              {partner}
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Box */}
      <div style={{ width: "75%", display: "flex", flexDirection: "column", padding: "10px" }}>
        <div style={{ flex: 1, overflowY: "auto", marginBottom: "10px" }}>
          {messages.map((msg) => (
            <div
              key={msg._id}
              style={{
                display: "flex",
                justifyContent: msg.sender === currentUserId ? "flex-end" : "flex-start",
                marginBottom: "5px"
              }}
            >
              <div
                style={{
                  padding: "8px 12px",
                  borderRadius: "15px",
                  backgroundColor: msg.sender === currentUserId ? "#007bff" : "#e5e5ea",
                  color: msg.sender === currentUserId ? "white" : "black",
                  maxWidth: "60%"
                }}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input Box */}
        <div style={{ display: "flex" }}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            style={{ flex: 1, padding: "10px", borderRadius: "20px", border: "1px solid #ccc" }}
          />
          <button
            onClick={sendMessage}
            style={{ marginLeft: "10px", padding: "10px 20px", borderRadius: "20px" }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;

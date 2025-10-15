import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import CryptoJS from "crypto-js";
import { useNavigate } from "react-router-dom";

const SECRET_KEY = "my_super_secret_key";
const socket = io("http://localhost:5000", { transports: ["websocket"] }); 
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";
const user = JSON.parse(localStorage.getItem("user"));
const currentUserId = user?.userId;

const ChatPage = () => {
  const [partners, setPartners] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const token = user?.token; 
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [partnerTyping, setPartnerTyping] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("typing", ({ senderId, isTyping }) => {
      if (senderId === selectedPartner) setPartnerTyping(isTyping);
    });
  }, [selectedPartner]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };


  useEffect(() => {
    if (currentUserId) socket.emit("join", currentUserId);
  }, []);

  function safeDecrypt(ciphertext) {
    try {
      const decrypted = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY).toString(CryptoJS.enc.Utf8);
      return decrypted || ciphertext;
    } catch {
      return ciphertext;
    }
  }

  const fetchUserById = async (userId) => {
    try {
      const res = await axios.get(`${API_BASE}/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch {
      return null;
    }
  };

  const fetchPartners = async () => {
    if(!currentUserId) return;  
    try {
      const res = await axios.get(`${API_BASE}/messages/getChatPartners/${currentUserId}`);
      const partnersData = await Promise.all(
        res.data.partners.map(async (id) => {
          const user = await fetchUserById(id);
          return { id, name: user?.fullName || "Unknown" };
        })
      );
      setPartners(partnersData);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMessages = async (partnerId) => {
    if(!partnerId) return;
    try {
      const res = await axios.get(`${API_BASE}/messages/getMessagesBetween/${currentUserId}/${partnerId}`);
      const decryptedMessages = res.data.messages.map(msg => ({
        ...msg,
        text: safeDecrypt(msg.text),
      }));
      setMessages(decryptedMessages);
    } catch (err) {
      console.error(err);
    }
  };

  const sendMessage = async () => {
    if (!newMessage || !selectedPartner) return;
    const encryptedText = CryptoJS.AES.encrypt(newMessage, SECRET_KEY).toString();
    try {
      await axios.post(`${API_BASE}/messages/send`, {
        sender: currentUserId,
        receiver: selectedPartner,
        text: encryptedText,
      });

      socket.emit("typing", { senderId: currentUserId, receiverId: selectedPartner, isTyping: false });
      setNewMessage("");
      socket.emit("messageSent", { senderId: currentUserId, receiverId: selectedPartner });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchPartners(); }, [currentUserId]);

  useEffect(() => {
    socket.on("refreshMessages", () => fetchMessages(selectedPartner));
    return () => socket.off("refreshMessages");
  }, [selectedPartner]);

  const selectPartner = (partnerId) => {
    setSelectedPartner(partnerId);
    fetchMessages(partnerId);
    scrollToBottom();
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  return (
    <div className="flex flex-col h-screen bg-purple-700 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-purple-800 shadow-md">
        <button
          onClick={() => navigate("/")}
          className="bg-white text-purple-700 font-semibold px-4 py-2 rounded-full hover:bg-gray-200 transition"
        >
          ⬅ Back
        </button>
        <h2 className="text-xl font-bold tracking-wide">Chat Room</h2>
        <div className="w-16"></div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Chat Partners */}
        <div className="w-1/4 bg-purple-800/40 backdrop-blur-md overflow-y-auto border-r border-purple-600">
          <h3 className="text-center py-4 font-semibold border-b border-purple-600">
            Chat Partners
          </h3>
          <ul className="divide-y divide-purple-500/30">
            {partners.map((partner) => (
              <li
                key={partner.id}
                onClick={() => selectPartner(partner.id)}
                className={`px-4 py-3 cursor-pointer hover:bg-purple-700 transition ${
                  selectedPartner === partner.id ? "bg-purple-700" : ""
                }`}
              >
                {partner.name}
              </li>
            ))}
          </ul>
        </div>

        {/* Chat Box */}
        <div className="w-3/4 flex flex-col relative">
          {/* Messages */}
          <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto p-5 space-y-3 bg-purple-100 text-black"
            onScroll={() => {
              const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
              setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 20);
            }}
          >
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`flex flex-col ${msg.sender === currentUserId ? "items-end" : "items-start"}`}
              >
                <div
                  className={`px-4 py-2 rounded-2xl max-w-[65%] break-words shadow ${
                    msg.sender === currentUserId ? "bg-purple-600 text-white" : "bg-white text-black"
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-xs text-gray-500 mt-1">{formatTime(msg.createdAt)}</span>
              </div>
            ))}

            {partnerTyping && (
              <div className="italic text-gray-600">
                {partners.find(p => p.id === selectedPartner)?.name} is typing...
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Scroll to Bottom */}
          {!isAtBottom && (
            <button
              onClick={scrollToBottom}
              className="absolute bottom-24 right-8 bg-purple-600 text-white rounded-full p-3 shadow-lg hover:bg-purple-700 transition"
            >
              ⬇
            </button>
          )}

          {/* Input Box */}
          <div className="flex items-center gap-3 p-4 bg-purple-900">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                if (selectedPartner) {
                  socket.emit("typing", {
                    senderId: currentUserId,
                    receiverId: selectedPartner,
                    isTyping: e.target.value.length > 0,
                  });
                }
              }}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-white bg-purple-100 text-black placeholder-gray-500"
            />
            <button
              onClick={sendMessage}
              className="px-5 py-2 bg-white text-purple-700 rounded-full font-semibold hover:bg-gray-200 transition"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;

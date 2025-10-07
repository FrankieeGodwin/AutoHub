import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000", { transports: ["websocket"] }); 
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";
const user = JSON.parse(localStorage.getItem("user"));
const currentUserId = user?.userId;

const ChatPage = () => {
  const [partners, setPartners] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const token = user?.token; // JWT token
  const messagesEndRef = useRef(null);
  const [shouldScroll, setShouldScroll] = useState(false);
  const messagesContainerRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const [partnerTyping, setPartnerTyping] = useState(false);

useEffect(() => {
  socket.on("typing", ({ senderId, isTyping }) => {
    if (senderId === selectedPartner) {
      setPartnerTyping(isTyping);
    }
  });
}, [selectedPartner]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
  if (currentUserId) socket.emit("join", currentUserId);
}, []);


  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedhours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedhours}:${formattedMinutes} ${ampm}`;
  };

//   const updateTyping = async (isTyping) => {
//   try {
//     await axios.post(`${API_BASE}/messages/typing`, {
//       sender: currentUserId,
//       receiver: selectedPartner,
//       typing: isTyping,
//     });
//   } catch (err) {
//     console.error(err);
//   }
// };


  const fetchUserById = async (userId) => {
    try {
      const res = await axios.get(`${API_BASE}/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const fetchPartners = async () => {
    try {
      if(!currentUserId) return;  
      const res = await axios.get(
        `${API_BASE}/messages/getChatPartners/${currentUserId}`
      );
      const partnerIds = res.data.partners;

      const partnersData = await Promise.all(
        partnerIds.map(async (id) => {
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
      const res = await axios.get(
        `${API_BASE}/messages/getMessagesBetween/${currentUserId}/${partnerId}`
      );
      setMessages(res.data.messages);
    } catch (err) {
      console.error(err);
    }
  };

  const sendMessage = async () => {
    if (!newMessage && !selectedPartner) return;
    try {
      await axios.post(`${API_BASE}/messages/send`, {
        sender: currentUserId,
        receiver: selectedPartner,
        text: newMessage,
      });
      setNewMessage("");
      setShouldScroll(true);
      await fetchMessages(selectedPartner);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (shouldScroll || isAtBottom) {
      scrollToBottom();
      setShouldScroll(false); // reset the flag
    }
  }, [messages]);


  const selectPartner = (partnerId) => {
    setSelectedPartner(partnerId);
    fetchMessages(partnerId);
  };

  useEffect(() => {
    fetchPartners();
  }, [currentUserId]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (selectedPartner) fetchMessages(selectedPartner);
    }, 1000);
    return () => clearInterval(interval);
  }, [selectedPartner]);

  return (
    <div className="flex h-[80vh] border border-gray-300 rounded-lg overflow-hidden shadow-lg">
      {/* Chat Partners */}
      <div className="w-1/4 bg-gray-100 border-r border-gray-300 overflow-y-auto">
        <h3 className="text-center py-4 bg-purple-600 text-white font-semibold">
          Chat Partners
        </h3>
        <ul className="list-none p-0 m-0">
          {partners.map((partner) => (
            <li
              key={partner.id}
              className={`px-4 py-3 cursor-pointer border-b border-gray-200 hover:bg-gray-200 transition-colors ${
                selectedPartner === partner.id ? "bg-gray-300" : ""
              }`}
              onClick={() => selectPartner(partner.id)}
            >
              {partner.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Box */}
      <div className="w-3/4 flex flex-col bg-white relative">
        {/* Messages */}
        <div
  ref={messagesContainerRef}
  className="flex-1 p-5 overflow-y-auto flex flex-col gap-3 bg-gray-50"
  onScroll={() => {
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 20); // 20px threshold
  }}
>
          {messages.map((msg) => (
            <div
              key={msg._id}
              className={`flex flex-col ${
                msg.sender === currentUserId ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-[60%] break-words shadow ${
                  msg.sender === currentUserId
                    ? "bg-purple-600 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                {msg.text}
              </div>
              <span className="text-xs text-gray-500 mt-1">
                {formatTime(msg.createdAt)}
              </span>
            </div>
          ))}
          {partnerTyping && (
  <div className="text-gray-500 italic px-4 py-1">
    {partners.find(p => p.id === selectedPartner)?.name} is typing...
  </div>
)}

          <div ref={messagesEndRef} />
        </div>

        {/* Scroll to Bottom Button */}
{!isAtBottom && (
  <button
    onClick={scrollToBottom}
    className="absolute bottom-20 right-10 bg-purple-600 text-white rounded-full p-3 shadow-lg hover:bg-purple-700 transition-all"
    title="Scroll to Bottom"
  >
    ⬇️
  </button>
)}


        {/* Input Box */}
        <div className="flex p-4 border-t border-gray-300 bg-white">
          <input
  type="text"
  value={newMessage}
  onChange={(e) => {
    setNewMessage(e.target.value);
    if (selectedPartner) {
      socket.emit("typing", {
        senderId: currentUserId,
        receiverId: selectedPartner,
        isTyping: e.target.value.length > 0, // true if typing
      });
    }
  }}
  className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
  onKeyDown={(e) => {
    if (e.key === "Enter") sendMessage();
  }}
  placeholder="Type a message..."
/>

          <button
            onClick={sendMessage}
            className="ml-3 px-6 py-2 rounded-full bg-purple-600 text-white font-semibold hover:bg-purple-800 transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;

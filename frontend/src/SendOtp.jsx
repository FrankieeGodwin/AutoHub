import { useState } from "react";
import axios from "axios";

export default function SendOtp() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const sendOtp = async () => {
    try {
      const response = await axios.post("http://localhost:5000/otp/send", { email });

      if (response.data.success) {
        setMessage("✅ OTP sent to your email!");
      } else {
        setMessage("❌ Failed: " + (response.data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("OTP Error:", error);

      if (error.response) {
        setMessage(`⚠️ Server Error: ${error.response.data.error || error.response.statusText}`);
      } else if (error.request) {
        setMessage("⚠️ No response from backend. Is it running?");
      } else {
        setMessage(`⚠️ Error: ${error.message}`);
      }
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>Send OTP</h2>
      <input
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          padding: "10px",
          marginRight: "10px",
          border: "1px solid #ccc",
          borderRadius: "5px",
        }}
      />
      <button
        onClick={sendOtp}
        style={{
          padding: "10px 15px",
          background: "blue",
          color: "white",
          border: "none",
          borderRadius: "5px",
        }}
      >
        Send OTP
      </button>
      <p style={{ marginTop: "10px" }}>{message}</p>
    </div>
  );
}

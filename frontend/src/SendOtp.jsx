import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

export default function SendOtp() {
  const location = useLocation();
  const { email } = location.state || {};
  const [message, setMessage] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const didRun = useRef(false);

  // Send OTP
  const sendOtp = async () => {
    if (!email) {
      setMessage("No email found. Please go back and register again.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/otp/send", { email });

      if (response.data.success) {
        // Store OTP with expiry in localStorage
        const expiresAt = Date.now() + 60 * 1000; // 1 min
        localStorage.setItem(
          `otp_${email}`,
          JSON.stringify({ otp: response.data.otp, expires: expiresAt })
        );

        setMessage("✅ OTP sent to your email!");
        setTimeLeft(60);
        setCanResend(false);
      } else {
        setMessage("❌ Failed: " + (response.data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("OTP Error:", error);
      setMessage("Error sending OTP. Try again later.");
    }
  };

  useEffect(() => {
    if (!didRun.current) {
      sendOtp();
      didRun.current = true;
    }
  }, [email]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) {
      setCanResend(true);
      // Remove OTP after 1 minute automatically
      const stored = localStorage.getItem(`otp_${email}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Date.now() >= parsed.expires) {
          localStorage.removeItem(`otp_${email}`);
        }
      }
      return;
    }

    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, email]);

  // Verify OTP
  const handleVerify = () => {
    const stored = localStorage.getItem(`otp_${email}`);
    if (!stored) {
      setMessage("❌ OTP expired. Please resend.");
      setCanResend(true);
      return;
    }

    const parsed = JSON.parse(stored);

    if (Date.now() > parsed.expires) {
      localStorage.removeItem(`otp_${email}`);
      setMessage("❌ OTP expired. Please resend.");
      setCanResend(true);
      return;
    }

    if (otpInput === parsed.otp.toString()) {
      setMessage("✅ OTP verified successfully!");
      localStorage.removeItem(`otp_${email}`);
      setCanResend(false);
    } else {
      setMessage("❌ Incorrect OTP. Please try again.");
    }
  };

  const handleResend = () => {
    setOtpInput("");
    sendOtp();
  };

  return (
    <div className="w-full h-screen bg-[#FAFAFA] flex items-center justify-center">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md border border-gray-200 text-center">
        <h2 className="text-2xl font-bold text-purple-700 mb-6">OTP Verification</h2>
        <p className="text-gray-700 mb-4">
          OTP sent to: <span className="font-semibold text-purple-600">{email}</span>
        </p>
        <p className="text-gray-800 mb-4">{message}</p>

        <input
          type="number"
          placeholder="Enter OTP"
          value={otpInput}
          onChange={(e) => setOtpInput(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 mb-4"
        />

        <button
          onClick={handleVerify}
          className="w-full py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition duration-300 mb-4"
        >
          Verify OTP
        </button>

        {canResend ? (
          <button
            onClick={handleResend}
            className="w-full py-3 bg-gray-400 text-white font-semibold rounded-xl hover:bg-gray-500 transition duration-300"
          >
            Resend OTP
          </button>
        ) : (
          <p className="text-gray-500">Resend OTP in {timeLeft}s</p>
        )}
      </div>
    </div>
  );
}

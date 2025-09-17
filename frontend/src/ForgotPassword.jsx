import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1=email, 2=otp, 3=new password
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const didRun = useRef(false);

  // OTP countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  // Step 1 → Send OTP
  const handleSubmitEmail = async () => {
    if (!email) {
      setMessage("Please enter your email.");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE}/otp/send`, { email });

      if (response.data.success) {
        const expiresAt = Date.now() + 60 * 1000;
        localStorage.setItem(
          `otp_${email}`,
          JSON.stringify({ otp: response.data.otp, expires: expiresAt })
        );
        setMessage("OTP sent to your email!");
        setStep(2);
        setTimeLeft(60);
        setCanResend(false);
      } else {
        setMessage("Failed: " + (response.data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("OTP Error:", error);
      setMessage("Error sending OTP. Try again later.");
    }
  };

  // Step 2 → Verify OTP
  const handleVerifyOtp = () => {
    const stored = localStorage.getItem(`otp_${email}`);
    if (!stored) {
      setMessage("OTP expired. Please resend.");
      setCanResend(true);
      return;
    }

    const parsed = JSON.parse(stored);
    if (Date.now() > parsed.expires) {
      localStorage.removeItem(`otp_${email}`);
      setMessage("OTP expired. Please resend.");
      setCanResend(true);
      return;
    }

    if (otpInput === parsed.otp.toString()) {
      setMessage("OTP verified! Please set a new password.");
      setStep(3);
      localStorage.removeItem(`otp_${email}`);
    } else {
      setMessage("Incorrect OTP. Try again.");
    }
  };

  // Step 2 → Resend OTP
  const handleResend = () => {
    setOtpInput("");
    handleSubmitEmail();
  };

  // Step 3 → Update password
  const handleResetPassword = async () => {
    if (!newPassword) {
      setMessage("Please enter a new password.");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE}/users/reset-password`, {
        email,
        newPassword,
      });

      if (response.data.success) {
        setMessage("Password updated successfully!");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setMessage("Failed to update password. Try again.");
      }
    } catch (error) {
      console.error("Reset Password Error:", error);
      setMessage("Server error. Try again later.");
    }
  };

  return (
    <div className="w-full h-screen bg-[#FAFAFA] flex items-center justify-center">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md border border-gray-200 text-center">
        <h2 className="text-2xl font-bold text-purple-700 mb-6">
          Forgot Password
        </h2>

        {/* Step 1 → Enter Email */}
        {step === 1 && (
          <>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 mb-4"
            />
            <button
              onClick={handleSubmitEmail}
              className="w-full py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition duration-300 mb-4"
            >
              Send OTP
            </button>
          </>
        )}

        {/* Step 2 → Enter OTP */}
        {step === 2 && (
          <>
            <p className="text-gray-700 mb-4">
              OTP sent to: <span className="font-semibold text-purple-600">{email}</span>
            </p>

            <input
              type="number"
              placeholder="Enter OTP"
              value={otpInput}
              onChange={(e) => setOtpInput(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 mb-4"
            />

            <button
              onClick={handleVerifyOtp}
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
          </>
        )}

        {/* Step 3 → Reset Password */}
        {step === 3 && (
          <>
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 mb-4"
            />

            <button
              onClick={handleResetPassword}
              className="w-full py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition duration-300 mb-4"
            >
              Reset Password
            </button>
          </>
        )}

        {/* Messages */}
        <p className="text-gray-800 mt-2">{message}</p>
      </div>
    </div>
  );
}

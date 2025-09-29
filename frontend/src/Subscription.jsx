import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Subscription = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.userId;

  const PLAN_PRICE = 50000; // ₹500 in paise

  const handlePayment = async () => {
    try {
      const { data: order } = await axios.post(
        "http://localhost:5000/api/payment/create-order",
        { amount: PLAN_PRICE }
      );

      const options = {
        key: "rzp_test_RFxhjAiTxwrpAJ",
        amount: order.amount,
        currency: order.currency,
        name: "AutoHub",
        description: "One-Time Subscription",
        order_id: order.id,
        handler: async function (response) {
          const verifyRes = await axios.post(
            "http://localhost:5000/api/payment/verify",
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              plan: "one-time",
              userId,
            }
          );

          if (verifyRes.data.success) {
            navigate("/addCar", {
              state: { plan: "one-time", paymentId: response.razorpay_payment_id },
            });
          } else {
            alert("❌ Payment verification failed!");
          }
        },
        prefill: {
          name: user?.fullName || "Guest User",
          email: user?.emailId || "guest@example.com",
          contact: "9999999999",
        },
        theme: { color: "#6D28D9" },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (err) {
      console.error("Payment error:", err);
      alert("Something went wrong. Try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FAFAFA] p-6">
      <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-lg w-full transform transition duration-500 hover:scale-105">
        {/* Heading */}
        <h1 className="text-3xl font-extrabold mb-6 text-center text-gray-800">
          Subscription Required
        </h1>

        {/* Info paragraph */}
        <p className="text-gray-600 text-center mb-6 leading-relaxed">
           To <span className="font-semibold text-purple-800">add your car</span> and enjoy all AutoHub
          services, please complete a one-time payment of just <b>₹500</b>. Unlock
          access to add, manage, and showcase your cars effortlessly.
        </p>

        {/* Pay Button */}
        <button
          onClick={handlePayment}
          className="w-full bg-purple-800 text-white py-3 rounded-xl font-bold text-lg shadow-lg hover:opacity-90 transition"
        >
          Pay ₹500 & Add Your Car 
        </button>

        {/* Extra note */}
        <p className="text-xs text-center mt-4 text-gray-500 italic">
          Secure payment powered by Razorpay 
        </p>
      </div>
    </div>
  );
};

export default Subscription;
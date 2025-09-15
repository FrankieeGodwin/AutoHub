import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const Subscription = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.userId;

  // Default plan from navigation or "monthly"
  const [plan, setPlan] = useState(location.state?.plan || "monthly");

  const PLAN_PRICES = {
    monthly: 19900, // ₹199 in paise
    yearly: 199000, // ₹1990 in paise
  };

  const handlePayment = async () => {
    try {
      const amount = PLAN_PRICES[plan];

      const { data: order } = await axios.post(
        "http://localhost:5000/api/payment/create-order",
        { amount }
      );

      const options = {
        key: "rzp_test_RFxhjAiTxwrpAJ",
        amount: order.amount,
        currency: order.currency,
        name: "AutoHub",
        description: `${plan === "monthly" ? "Monthly" : "Yearly"} Subscription`,
        order_id: order.id,
        handler: async function (response) {
          const verifyRes = await axios.post(
            "http://localhost:5000/api/payment/verify",
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              plan,
              userId,
            }
          );

          if (verifyRes.data.success) {
            navigate("/addCar", {
              state: { plan, paymentId: response.razorpay_payment_id },
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-lg w-full">
        <h1 className="text-3xl font-extrabold mb-8 text-center text-gray-800">
          Choose Your Subscription
        </h1>

        {/* Subscription Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          {/* Monthly Plan */}
          <div
            onClick={() => setPlan("monthly")}
            className={`cursor-pointer border-2 rounded-xl p-6 text-center transition transform hover:scale-105 ${
              plan === "monthly"
                ? "border-purple-600 bg-purple-50 shadow-lg"
                : "border-gray-200 bg-white"
            }`}
          >
            <h2 className="text-xl font-bold text-purple-700">Monthly</h2>
            <p className="text-gray-600">₹199 / month</p>
            <p className="text-xs text-gray-500 mt-2">Cancel anytime</p>
          </div>

          {/* Yearly Plan */}
          <div
            onClick={() => setPlan("yearly")}
            className={`cursor-pointer border-2 rounded-xl p-6 text-center transition transform hover:scale-105 ${
              plan === "yearly"
                ? "border-purple-600 bg-purple-50 shadow-lg"
                : "border-gray-200 bg-white"
            }`}
          >
            <h2 className="text-xl font-bold text-purple-700">Yearly</h2>
            <p className="text-gray-600">₹1990 / year</p>
            <p className="text-xs text-green-600 mt-2 font-semibold">
              Save 20% 🎉
            </p>
          </div>
        </div>

        {/* Pay Button */}
        <button
          onClick={handlePayment}
          className="w-full bg-gradient-to-r from-purple-700 via-pink-600 to-red-500 text-white py-3 rounded-xl font-bold text-lg shadow-lg hover:opacity-90 transition"
        >
          Pay {plan === "monthly" ? "₹199" : "₹1990"}
        </button>
      </div>
    </div>
  );
};

export default Subscription;

import React from "react";
import axios from "axios";
import { useNavigate,useLocation } from "react-router-dom";


const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.userId;
  const carId = location.state?.carId;
  const API_BASE = import.meta.env.VITE_API_BASE;

  const handlePayment = async () => {
    try {
      // 1️⃣ Create order from backend
      const { data: order } = await axios.post("http://localhost:5000/api/payment/create-order", {
        amount: 50000, // amount in paise = ₹500
      });

      // 2️⃣ Open Razorpay checkout
      const options = {
        key: "rzp_test_RFxhjAiTxwrpAJ", // replace with your Razorpay test key
        amount: order.amount,
        currency: order.currency,
        name: "AutoHub",
        description: "Payment for Car Booking",
        order_id: order.id,
        handler: async function (response) {
          // 3️⃣ Verify payment on backend
          const verifyRes = await axios.post("http://localhost:5000/api/payment/verify", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          if (verifyRes.data.success) {
            const paymentStore = await axios.post(`${API_BASE}/payment/create`, {
              userId : userId,
              carId : carId,
              paymentId : response.razorpay_payment_id,
              amount : 500,
              type : "Seller-Details",
              status : "Completed"
            })
            navigate("/carView", { state: { userId : userId , carId: carId, paymentId: response.razorpay_payment_id, }, });
            // alert("✅ Payment successful!");
          } else {
            alert("❌ Payment verification failed!");
          }
        },
        prefill: {
          name: "Sathish",
          email: "sathish@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#F37254",
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (err) {
      console.error("Payment error:", err);
      alert("Something went wrong. Try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#FAFAFA]">
      <h1 className="text-2xl font-bold mb-4">Proceed to Payment</h1>
      <button
        onClick={handlePayment}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Pay ₹500
      </button>
    </div>
  );
};

export default Payment;

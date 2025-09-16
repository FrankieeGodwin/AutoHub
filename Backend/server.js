import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import Razorpay from "razorpay";
import crypto from "crypto";
import connectDB from "./db.js";
import userRouter from "./routes/userRouter.js";
import carRouter from "./routes/carRouter.js";
import otpRouter from "./routes/otpRouter.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import contactRouter from './routes/contactRouter.js'

const app = express();
app.use(express.json());
app.use(cors());   

// Connect DB
connectDB().catch(err => {
  console.error("MongoDB connection failed:", err.message);
});

// Routes
app.use("/users", userRouter);
app.use("/cars", carRouter);
app.use("/otp", otpRouter);
app.use("/uploadApi", uploadRoutes);
app.use("/contact", contactRouter);


// 🔹 Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 🔹 Create order API
app.post("/api/payment/create-order", async (req, res) => {
  try {
    const { amount } = req.body; // amount in paise
    const options = {
      amount: amount || 50000, // default ₹500
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    console.error("Order creation failed:", err);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// 🔹 Verify payment API
app.post("/api/payment/verify", (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      res.json({ success: true, message: "Payment verified" });
    } else {
      res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (err) {
    console.error("Verification failed:", err);
    res.status(500).json({ error: "Verification error" });
  }
});


// Error handler
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
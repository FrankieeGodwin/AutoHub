import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import connectDB from "./db.js";
import userRouter from "./routes/userRouter.js";
import carRouter from "./routes/carRouter.js";
import otpRouter from "./routes/otpRouter.js";
import uploadRoutes from "./routes/uploadRoutes.js";

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
// Error handler
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
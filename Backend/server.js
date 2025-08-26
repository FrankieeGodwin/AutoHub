import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db.js';
import userRouter from './routes/userRouter.js'; 
import carRouter from './routes/carRouter.js';
import otpRouter from './routes/otpRouter.js';  // 👈 import otp router

dotenv.config();

const app = express();
app.use(express.json());

connectDB();

// Routers
app.use('/users', userRouter);
app.use('/cars', carRouter);
app.use('/otp', otpRouter); // 👈 mount otp router

// Error handler
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

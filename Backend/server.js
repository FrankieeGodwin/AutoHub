import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db.js';
import userRouter from './routes/userRouter.js'; 

dotenv.config();

const app = express();

app.use(express.json());

connectDB();

app.use('/users', userRouter);

app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
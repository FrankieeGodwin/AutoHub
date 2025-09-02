import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000);
}
router.post("/send", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, error: "Email is required" });

  const otp = generateOTP();

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}. It will expire in 1 minute.`,
    });

    res.json({ success: true, otp }); 
  } catch (err) {
    console.error("Mail Error:", err.message);
    res.status(500).json({ success: false, error: "Failed to send OTP" });
  }
});

export default router;

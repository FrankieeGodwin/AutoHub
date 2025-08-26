import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

// OTP generator
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000);
}

// POST /otp/send
router.post("/send", async (req, res) => {
  const { email } = req.body;
  const otp = generateOTP();

  try {
    // Gmail Transporter (App Password required)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // from .env
        pass: process.env.EMAIL_PASS, // app password
      },
    });

    // Send mail
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    });

    res.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to send OTP" });
  }
});

export default router;

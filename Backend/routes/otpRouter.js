import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();
const otpStore = {}; // { email: { otp, expires } }

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000);
}

// POST /otp/send
router.post("/send", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, error: "Email is required" });

  const otp = generateOTP();
  const expires = Date.now() + 60 * 1000; // 1 minute expiry
  otpStore[email] = { otp, expires };

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

    res.json({ success: true, otp }); // send OTP in response for frontend
  } catch (err) {
    console.error("Mail Error:", err.message);
    res.status(500).json({ success: false, error: "Failed to send OTP" });
  }
});

// POST /otp/verify (optional)
router.post("/verify", (req, res) => {
  const { email, otp } = req.body;
  const record = otpStore[email];

  if (!record) return res.json({ success: false, error: "No OTP found" });
  if (Date.now() > record.expires) {
    delete otpStore[email];
    return res.json({ success: false, error: "OTP expired" });
  }

  if (parseInt(otp) === record.otp) {
    delete otpStore[email];
    return res.json({ success: true, message: "OTP verified successfully" });
  }

  return res.json({ success: false, error: "Invalid OTP" });
});

export default router;

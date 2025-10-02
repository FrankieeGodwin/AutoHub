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
import contactRouter from "./routes/contactRouter.js";
import User from "./models/user.model.js";
import Dealer from "./models/Dealer.model.js";
import dealerRouter from "./routes/dealerRouter.js";
import UserActivityRouter from "./routes/UserActivityRouter.js"
// Google login imports
import session from "express-session";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import jwt from "jsonwebtoken";

const app = express();
app.use(express.json());
app.use(cors(
    {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }
));

// ---------------- Session (required for passport) ---------------- //
app.use(
  session({
    secret: process.env.SESSION_SECRET || "autohub_secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      sameSite: "lax", // important for OAuth
      secure: false,   // set to true if using HTTPS in production
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// ---------------- Connect to MongoDB ---------------- //
connectDB().catch((err) => console.error("MongoDB connection failed:", err.message));

// Routes
app.use("/users", userRouter);
app.use("/cars", carRouter);
app.use("/otp", otpRouter);
app.use("/uploadApi", uploadRoutes);
app.use("/contact", contactRouter);
app.use("/dealers", dealerRouter);
app.use("/activity",UserActivityRouter);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Only used by server for OAuth flow
      callbackURL: "http://localhost:5000/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      // Here you can save user info to DB if needed
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

// ---------------- Google Login Routes ---------------- //
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["openid", "profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  async (req, res) => {
    try {
      const email = req.user?.emails?.[0]?.value || req.user?._json?.email;
      
      const user = await User.findOne({ emailId: email });
      if (!user) {
        // ❌ Not found → redirect with error
        const dealer = await Dealer.findOne({Email : email});
        if(!dealer)
        {
            return res.redirect(
              `${process.env.FRONTEND_URL || "http://localhost:5173"}/login?error=UserNotFound`
            );
        }
        const { PasswordHash, _id, ...rest } = dealer.toObject();

        const token = jwt.sign(
          {
            id: _id.toString(),  // 👈 top-level field
            ...rest,
            role: "dealer"
          },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/dealerLogin?token=${encodeURIComponent(token)}`);
      }

      const token = jwt.sign(
        {
          id: user._id,
          emailId: user.emailId,
          fullName: user.fullName,
          phoneNo: user.phoneNo,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );  
//       const token = jwt.sign(
//         { id: user._id },
//         process.env.JWT_SECRET,
//         { expiresIn: "1h" }
//       );

      // Redirect frontend with token
      res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/login?token=${encodeURIComponent(token)}`);

    } catch (err) {
      console.error("Error in Google callback:", err);
      res.redirect("/auth/failure");
    }
  }
);

app.get("/auth/failure", (req, res) => {
  res.status(400).send("Google OAuth failed");
});
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

app.post("/api/payment/create-order", async (req, res) => {
  try {
    const { amount } = req.body; // amount in paise
    const options = {
      amount: amount || 50000,
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

app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

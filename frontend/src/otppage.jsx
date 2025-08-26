import { useState } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

// ✅ Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBcyRqrbpE1cvQxlYG4Nl_On4PyqPREovE",
  authDomain: "otp-project-b6f41.firebaseapp.com",
  projectId: "otp-project-b6f41",
  storageBucket: "otp-project-b6f41.firebasestorage.app",
  messagingSenderId: "161773920602",
  appId: "1:161773920602:web:22339a9d960e1ce09e9363",
  measurementId: "G-JKFNCGM3G8",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function OTPPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);

  const setUpRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth, // ✅ auth goes first
        "recaptcha-container",
        { size: "invisible" }
      );
    }
  };

  const sendOTP = async () => {
    try {
      setUpRecaptcha();
      const result = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        window.recaptchaVerifier
      );
      setConfirmationResult(result);
      alert("OTP sent successfully!");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const verifyOTP = async () => {
    if (!confirmationResult) return alert("Request OTP first");
    try {
      const result = await confirmationResult.confirm(otp);
      alert("Authentication successful! User: " + result.user.phoneNumber);
    } catch (error) {
      console.error(error);
      alert("Verification failed: " + error.message);
    }
  };

  return (
    <div>
      <h2>Firebase Phone Authentication</h2>
      <div id="recaptcha-container"></div>

      <input
        type="text"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        placeholder="+91XXXXXXXXXX"
      />
      <button onClick={sendOTP}>Send OTP</button>
      <br />
      <br />

      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter OTP"
      />
      <button onClick={verifyOTP}>Verify & Sign In</button>
    </div>
  );
}



// import { useState, useEffect, useRef } from "react";
// import { useLocation } from "react-router-dom";
// import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";

// // ✅ Firebase config
// const firebaseConfig = {
//   apiKey: "AIzaSyBcyRqrbpE1cvQxlYG4Nl_On4PyqPREovE",
//   authDomain: "otp-project-b6f41.firebaseapp.com",
//   projectId: "otp-project-b6f41",
//   storageBucket: "otp-project-b6f41.firebasestorage.app",
//   messagingSenderId: "161773920602",
//   appId: "1:161773920602:web:22339a9d960e1ce09e9363",
//   measurementId: "G-JKFNCGM3G8"
// };

// // ✅ Initialize Firebase
// const app = initializeApp(firebaseConfig);
// getAnalytics(app);
// const auth = getAuth(app);

// export default function Otppage() {
//   const location = useLocation();
//   const [phoneNumber] = useState(location.state?.phone || "");
//   const [otp, setOtp] = useState("");
//   const [confirmationResult, setConfirmationResult] = useState(null);
//   const [message, setMessage] = useState("");
//   const recaptchaVerifierRef = useRef(null);

//   useEffect(() => {
//     if (phoneNumber) {
//       if (!recaptchaVerifierRef.current) {
//         setUpRecaptcha(auth);
//       }
//       sendOTP(phoneNumber);
//     } else {
//       setMessage("Please go back to the registration page and enter your phone number.");
//     }
//   }, [phoneNumber]);

//   // ✅ Setup Recaptcha using useRef
//   const setUpRecaptcha = (firebaseAuth) => {
//     recaptchaVerifierRef.current = new RecaptchaVerifier(
//       "recaptcha-container",
//       {
//         size: "invisible",
//         // callback: (response) => {
//         //   console.log("Recaptcha verified ✅");
//         // },
//       },
//       firebaseAuth
//     );
//   };

//   // ✅ Send OTP
//   const sendOTP = async (num) => {
//     try {
//       const formattedPhoneNumber = num.startsWith('+') ? num : `+91${num}`;
//       if (!recaptchaVerifierRef.current) {
//         throw new Error("reCAPTCHA verifier not initialized.");
//       }
//       const appVerifier = recaptchaVerifierRef.current;
//       const result = await signInWithPhoneNumber(auth, formattedPhoneNumber, appVerifier);
//       setConfirmationResult(result);
//       setMessage("📩 OTP has been sent to your phone!");
//     } catch (error) {
//       console.error("Error sending OTP:", error);
//       setMessage("❌ Error sending OTP: " + error.message);
//     }
//   };

//   // ✅ Verify OTP
//   const verifyOTP = async () => {
//     if (!otp || !confirmationResult) {
//       setMessage("Please enter a valid OTP.");
//       return;
//     }
//     try {
//       await confirmationResult.confirm(otp);
//       setMessage("✅ Phone number verified successfully!");
//     } catch (error) {
//       console.error("Error verifying OTP:", error);
//       setMessage("❌ Invalid OTP. Try again.");
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
//       <div className="p-6 bg-white shadow-lg rounded-xl w-96">
//         <h2 className="text-xl font-bold mb-4">📱 Phone OTP Verification</h2>

//         {/* Display phone number received from the Register component */}
//         {phoneNumber ? (
//           <p className="text-center text-gray-600 mb-4">
//             Awaiting OTP for **{phoneNumber}**
//           </p>
//         ) : null}

//         {/* OTP Input */}
//         <input
//           type="text"
//           placeholder="Enter OTP"
//           className="border p-2 rounded w-full mb-3"
//           value={otp}
//           onChange={(e) => setOtp(e.target.value)}
//         />
//         <button
//           onClick={verifyOTP}
//           className="bg-green-500 text-white px-4 py-2 rounded w-full"
//         >
//           Verify OTP
//         </button>

//         <p className="mt-3 text-gray-700 text-center">{message}</p>
//       </div>

//       {/* 🔹 Recaptcha container */}
//       <div id="recaptcha-container"></div>
//     </div>
//   );
// }
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import signupimage from "./assets/signup image.png";

export default function DealerRegister() {
  const [dealerName, setDealerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [businessLicense, setBusinessLicense] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const validateGST = (gst) => {
    // Simple GST pattern: 15 characters, alphanumeric, first 2 digits are state code
    return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gst);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!dealerName) {
      alert("Please enter your Dealer Name.");
      return;
    }

    if (!validateEmail(email)) {
      alert("Please enter a valid email.");
      return;
    }

    if (!phone || phone.length !== 10) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }

    if (!businessLicense) {
      alert("Please enter your Business License Number.");
      return;
    }

    if (!gstNumber || !validateGST(gstNumber)) {
      alert("Please enter a valid GST Number.");
      return;
    }

    if (!password || password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    // Navigate and pass all dealer info to OTP or next step
    navigate("/dealerOtp", { state: { dealerName, email, phone, businessLicense, gstNumber, password } });
  };

  return (
    <div className="w-full h-screen flex bg-gray-50">
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-purple-600 to-purple-900 text-white flex-col justify-center items-center">
        <img src={signupimage} alt="Image Loading" />
      </div>
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center">
        <div className="p-10 rounded-2xl w-full max-w-md">
          <h2 className="text-3xl mb-8 text-center">
            Join AutoHub as Dealer
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <input
                type="text"
                value={dealerName}
                onChange={(e) => setDealerName(e.target.value)}
                placeholder="Enter Dealer Name"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <div className="mb-6">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <div className="mb-6">
              <input
                type="number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter phone number"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <div className="mb-6">
              <input
                type="text"
                value={businessLicense}
                onChange={(e) => setBusinessLicense(e.target.value)}
                placeholder="Enter Business License Number"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <div className="mb-6">
              <input
                type="text"
                value={gstNumber}
                onChange={(e) => setGstNumber(e.target.value)}
                placeholder="Enter GST Number"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <div className="mb-6">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-purple-800 text-white font-semibold rounded-xl hover:bg-purple-900 transition duration-300"
            >
              Submit
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}

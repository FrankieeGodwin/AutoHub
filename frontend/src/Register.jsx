import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import signupimage from "./assets/signup image.png"
export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!phone || phone.length !== 10) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }

    if (!email) {
      alert("Please enter a valid email.");
      return;
    }

    // Navigate and pass only email
    navigate("/Otp", { state: { username, email, phone, password } });
  };

  return (
    <div className="w-full h-screen flex bg-gray-50">
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-purple-600 to-purple-900 text-white flex-col justify-center items-center">
      <img src={signupimage} alt="Image Loading" />
      </div>
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center">
        <div className="p-10 rounded-2xl w-full max-w-md">
          <h2 className="text-3xl  mb-8 text-center">
            Join AutoHub
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
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

          <p className="text-center text-gray-600 mt-6">
            Already have an account?{" "}
            <Link to="/login">
              <button className="text-purple-800 font-semibold hover:underline">
                Login
              </button>
            </Link>
          </p>
        </div>
      </div>
      
    </div>
  );
}

import React, { useState } from "react";
import {Link} from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    if (username === "Sathish" && password === "3718") {
      alert("Login Successful ✅");
    } else {
      alert("Invalid username or password ❌");
    }
  };

  return (
    <div className="w-full h-screen bg-[#FAFAFA] flex items-center justify-center">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md border border-gray-200">
        
        {/* Title */}
        <h2 className="text-3xl font-bold text-purple-700 mb-8 text-center">
          Login
        </h2>

        {/* Username */}
        <div className="mb-6">
          <label className="block text-lg text-gray-700 mb-2">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 
                       focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block text-lg text-gray-700 mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 
                       focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full py-3 bg-purple-600 text-white font-semibold 
                     rounded-xl hover:bg-purple-700 transition duration-300"
        >
          Submit
        </button>

        {/* Extra Links */}
        <p className="text-center text-gray-600 mt-6">
          Don’t have an account?{" "}
          <Link to="/Register">
          <button className="text-purple-600 font-semibold hover:underline">Register</button>
          </Link>
        </p>
      </div>
    </div>
  );
}

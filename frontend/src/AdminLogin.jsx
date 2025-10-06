// AdminLogin.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import loginimage from "./assets/login image.png";
import logo from "./assets/logo.png";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`${API_BASE}/admin-login`, {
        email,
        password,
      });

      if (response.status === 200) {
        const { token, email } = response.data; // assuming your backend sends these
        const adminObj = { email, token };

        // Save JWT token and admin info in localStorage
        localStorage.setItem("adminToken", token);
        localStorage.setItem("admin", JSON.stringify(adminObj));

        alert("Admin Login Successful!");
        console.log(adminObj);
        console.log(token);
        navigate("/admin-dashboard", { replace: true });
      }
    } catch (err) {
      if (err.response) {
        if (err.response.status === 401) alert("Invalid Email or Password");
        else alert("Unexpected error: " + err.response.data.message);
      } else {
        alert("Internal Server Error");
      }
    }
  };

  return (
    <div className="w-full h-screen flex">
      {/* Left image for desktop */}
      <div className="hidden md:flex w-1/2">
        <img src={loginimage} alt="Admin Panel" className="object-cover h-full w-full" />
      </div>

      {/* Login Card */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-white">
        <div className="w-full max-w-md p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img src={logo} alt="logo" className="h-12 w-auto" />
          </div>

          <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
            Admin Login
          </h2>

          {/* Email & Password */}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="w-full px-4 py-3 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-3 mb-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />

          <p className="text-right text-purple-700 py-4">
            <Link to="/ForgotPassword" className="text-purple-900 hover:underline">
              Forgot Password?
            </Link>
          </p>

          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-purple-800 text-white font-medium rounded-lg hover:bg-purple-900 transition"
          >
            Log in
          </button>

          <p className="text-center text-gray-600 mt-6">
            Are you a Dealer?{" "}
            <Link to="/dealerLogin" className="text-purple-800 font-semibold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

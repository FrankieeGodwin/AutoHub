// Login.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {jwtDecode} from "jwt-decode";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

  // ---------------- Handle Google JWT token from backend redirect ----------------
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get("token");
    const error = query.get("error");

    if(error==="UserNotFound"){
      alert("User not registered. Please sign up first.");
      navigate("/Register");
      return;
    }

    if (token) {
      try {
        const user = jwtDecode(token);

        const userObj = {
          userId: user.id,
          emailId: user.emailId,
          fullName: user.fullName,
          phoneNo: user.phoneNo, // fallback if not provided
          token 
        };
        alert("Login Successful! Welcome, " + userObj.fullName + userObj.emailId + userObj.userId + userObj.phoneNo + userObj.token);
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userObj)); // save user info
        console.log("Google login success:", userObj);
         window.history.replaceState({}, document.title, window.location.pathname);
       // navigate("/", { replace: true });
      navigate("/", { replace: true });
      } catch (err) {
        console.error("Failed to decode token:", err);
      }
    }
  }, [location.search, navigate]);

  // ---------------- Traditional login ----------------
  const handleSubmit = async () => {
    try {
      const response = await axios.post(`${API_BASE}/users/login`, {
        emailId: username,
        passwordHash: password,
      });

      if (response.status === 200) {
        const { token, userId, emailId, fullName, phoneNo } = response.data;
        const userObj = { userId, emailId, fullName, phoneNo, token };
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userObj)); // save user info
        navigate("/");
      }
    } catch (err) {
      if (err.response) {
        if (err.response.status === 401) alert("Invalid Email or Password");
        else if (err.response.status === 404) alert("User not found");
        else alert("Unexpected error: " + err.response.data.message);
      } else {
        alert("Some Internal Server Error");
      }
    }
  };

  // ---------------- Google Login ----------------
  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE}/auth/google`;
  };


  return (
    <div className="w-full h-screen bg-[#FAFAFA] flex items-center justify-center">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md border border-gray-200">
        <h2 className="text-3xl font-bold text-purple-700 mb-8 text-center">
          Login
        </h2>

        <div className="mb-6">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter email"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        <div className="mb-0">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 
                       focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>


        <p className="text-right text-purple-700 py-4">
              <Link to="/ForgotPassword" className="hover:underline">
              Forgot Password?
              </Link>
        </p>
        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full py-3 bg-purple-600 text-white font-semibold 
                     rounded-xl hover:bg-purple-700 transition duration-300"
        >
          Submit
        </button>

        {/* Continue with Google */}
        <button
          onClick={handleGoogleLogin}
          className="w-full mt-4 py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition duration-300"
        >
          Continue with Google
        </button>

        {/* Register */}
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


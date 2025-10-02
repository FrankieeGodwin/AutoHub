// Login.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {jwtDecode} from "jwt-decode"; // fixed import
import loginimage from "./assets/login image.png";
import logo from "./assets/logo.png" // make sure logo is inside src/assets

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

  // ---------------- Handle Google JWT token ----------------
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get("token");
    const error = query.get("error");

    if (error === "UserNotFound") {
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
          phoneNo: user.phoneNo,
          token,
        };

        alert(`Login Successful! Welcome, ${userObj.fullName}`);
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userObj));

        console.log("Google login success:", userObj);
        console.log("Google login success:", userObj);
        // Remove token from URL
        window.history.replaceState({}, document.title, window.location.pathname);
        navigate("/", { replace: true });
      } catch (err) {
        console.error("Failed to decode token:", err);
      }
    }
  }, [location.search, navigate]);

  // ---------------- Traditional login ----------------
  // const handleSubmit = async () => {
  //   try {
  //     const response = await axios.post(`${API_BASE}/users/login`, {
  //       emailId: username,
  //       passwordHash: password,
  //     });

  //     if (response.status === 200) {
  //       const { token, userId, emailId, fullName, phoneNo } = response.data;
  //       const userObj = { userId, emailId, fullName, phoneNo, token };
  //       localStorage.setItem("token", token);
  //       localStorage.setItem("user", JSON.stringify(userObj));
  //       navigate("/");
  //     }
  //   } catch (err) {
  //     if (err.response) {
  //       if (err.response.status === 401) alert("Invalid Email or Password");
  //       else if (err.response.status === 404) alert("User not found");
  //       else alert("Unexpected error: " + err.response.data.message);
  //     } else {
  //       alert("Some Internal Server Error");
  //     }
  //   }
  // };

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
    <div className="w-full h-screen flex">
      

      <div className="hidden md:flex w-1/2 flex-col ">
        <img src={loginimage} alt="AutoHub Logo"/>
      </div>


      <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-white">
        <div className="w-full max-w-md p-8">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
            Log in
          </h2>

          {/* Google Login */}
          <div className="mb-4">
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-2 py-3 border rounded-lg hover:bg-gray-50 transition"
            >
              <img
                src="https://www.svgrepo.com/show/355037/google.svg"
                alt="Google"
                className="w-5 h-5"
              />
              Continue with Google
            </button>
          </div>

          <div className="flex items-center my-4">
            <hr className="flex-grow border-gray-300" />
            <span className="px-3 text-gray-500 text-sm">Or with email</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          {/* Email & Password */}
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
            Don’t have an account?{" "}
            <Link to="/Register" className="text-purple-800 font-semibold hover:underline">
              Sign Up
            </Link>
          </p>
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

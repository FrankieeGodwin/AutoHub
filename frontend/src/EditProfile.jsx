import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
const API_BASE = "http://localhost:5000"; // replace with your backend URL
import NavBarBasic from "./NavBarBasic";
import Footer from "./Footer";

export default function EditProfile() {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const { userId, emailId, fullName, phoneNo, token } = storedUser || {};
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: fullName || "",
    emailId: emailId || "",
    phoneNo: phoneNo || "",
  });

  useEffect(() => {
    // Optionally fetch user details from backend to prefill
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.patch(
        `${API_BASE}/users/update`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Assuming phoneNo is not returned or not needed in localStorage for basic user info
      // I've kept your original logic but you might want to include phoneNo if it's important
      localStorage.setItem(
        "user",
        JSON.stringify({
          userId,
          emailId: res.data.emailId,
          fullName: res.data.fullName,
          phoneNo: res.data.phoneNo, // Added phoneNo back in the update
          token,
        })
      );

      alert("Profile updated successfully!");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  return (
    // Updated background and structure for a cleaner look
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NavBarBasic />

      <div className="flex justify-center items-center flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <form
          onSubmit={handleSubmit}
          // Enhanced shadow, border, and hover effects
          className="bg-white shadow-xl border border-purple-100 rounded-3xl p-8 sm:p-10 w-full max-w-lg transform transition-all duration-500 hover:shadow-2xl hover:border-purple-200"
        >
          <h2 className="text-4xl font-extrabold mb-8 text-center text-purple-800 tracking-tight">
            Manage Your Profile
          </h2>
          <p className="text-center text-gray-500 mb-6">
            Update your personal information below.
          </p>
          
          {/* Input Fields Container */}
          <div className="space-y-6">
            {/* Full Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                // Enhanced input styling
                className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-all duration-300 shadow-sm hover:border-purple-400"
                required
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="emailId"
                value={formData.emailId}
                onChange={handleChange}
                // Enhanced input styling
                className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-all duration-300 shadow-sm hover:border-purple-400"
                required
              />
            </div>

            {/* Phone Number Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                name="phoneNo"
                value={formData.phoneNo}
                onChange={handleChange}
                // Enhanced input styling
                className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-all duration-300 shadow-sm hover:border-purple-400"
                required
              />
            </div>
          </div>
          
          <div className="mt-8">
            <button
              type="submit"
              // Significantly enhanced button styling with a stronger gradient and interactive effects
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-50"
            >
              Save Changes
            </button>
          </div>

          <div className="mt-6 text-center">
             <Link to="/" className="text-sm font-medium text-gray-500 hover:text-purple-600 transition-colors duration-200">
               Cancel and go back to Home
             </Link>
           </div>

        </form>
      </div>
      <Footer />
    </div>
  );
}
import React, { useState, useEffect } from "react";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
const API_BASE = "http://localhost:5000"; // replace with your backend URL
import NavBarBasic from "./NavBarBasic";
import Footer from "./Footer";
export default function EditProfile() {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const { userId, emailId, fullName, phoneNo , token } = storedUser || {};
  const navigate=useNavigate();
  const [formData, setFormData] = useState({
    fullName: fullName || "",
    emailId: emailId || "",
    phoneNo: phoneNo || "",
  });

  useEffect(() => {
    // If you want, you can fetch user details again from backend to prefill
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

      // Update localStorage with new values
      localStorage.setItem(
        "user",
        JSON.stringify({
          userId,
          emailId: res.data.emailId,
          fullName: res.data.fullName,
          token,
        })
      );

      alert("Profile updated successfully!");
      navigate("/")
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div>
      <NavBarBasic/>
    <div className="flex justify-center items-center min-h-screen bg-[#FAFAFA]">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl p-6 w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Edit Profile</h2>

        <label className="block mb-2 font-medium">Full Name</label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded-lg mb-4"
          required
        />

        <label className="block mb-2 font-medium">Email</label>
        <input
          type="email"
          name="emailId"
          value={formData.emailId}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded-lg mb-4"
          required
        />

        <label className="block mb-2 font-medium">Phone Number</label>
        <input
          type="text"
          name="phoneNo"
          value={formData.phoneNo}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded-lg mb-6"
          required
        />

        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
        >
          Save Changes
        </button>
      </form>
    </div>
    <Footer/>
    </div>
  );
}

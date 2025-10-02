import { useState, useEffect } from "react";
import NavBarBasic from "./NavBarBasic";
import Footer from "./Footer";
import { Cog6ToothIcon, ChevronRightIcon, StarIcon, TruckIcon, ClockIcon, EnvelopeIcon, PhoneIcon, UserIcon } from '@heroicons/react/24/outline';
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const users = JSON.parse(localStorage.getItem("user"));
  const user = users; // assuming user object contains fullName, emailId, phoneNo
  const navigate = useNavigate();

  if (!user) {
    return <p className="text-center mt-10 text-red-500">User not found.</p>;
  }

  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      <NavBarBasic />
      <div className="mt-[5%] flex justify-center px-4 md:px-10 py-10">
        {/* Left Panel - Profile */}
        <div className="md:w-1/3 bg-white shadow-2xl rounded-2xl p-6 sticky top-20 h-fit">
          <h1 className="text-3xl font-bold text-center mb-6">Profile</h1>
          
          {/* Profile Info */}
          <div className="space-y-4">
            <p className="flex space-x-6 bg-purple-50 p-3 rounded-lg shadow-sm">
              <UserIcon className="h-6 w-6 text-gray-700" /> <span>{user.fullName}</span>
            </p>
            <p className="flex space-x-6 bg-purple-50 p-3 rounded-lg shadow-sm">
              <EnvelopeIcon className="h-6 w-6 text-gray-700" /> <span>{user.emailId}</span>
            </p>
            <p className="flex space-x-6 bg-purple-50 p-3 rounded-lg shadow-sm">
              <PhoneIcon className="h-6 w-6 text-gray-700" /> <span>{user.phoneNo}</span>
            </p>
          </div>

          {/* Buttons to navigate to separate pages */}
          <div className="mt-6 space-y-3">
            <button
              onClick={() => navigate("/EditProfile")}
              className="flex justify-between w-full px-6 py-2 bg-gray-200 hover:bg-gray-300 transition"
            >
              <div className="flex space-x-6">
                <Cog6ToothIcon className="h-6 w-6 text-gray-700" />
                <span>Edit Profile</span>
              </div>
              <ChevronRightIcon className="h-5 w-5 text-gray-500" />
            </button>

            <button
              onClick={() => navigate("/YourCars")}
              className="flex justify-between w-full px-6 py-2 bg-gray-200 hover:bg-gray-300 transition"
            >
              <div className="flex space-x-6">
                <TruckIcon className="h-6 w-6 text-gray-700" />
                <span>Your Cars</span>
              </div>
              <ChevronRightIcon className="h-5 w-5 text-gray-500" />
            </button>

            <button
              onClick={() => navigate("/Favorites")}
              className="flex justify-between w-full px-6 py-2 bg-gray-200 hover:bg-gray-300 transition"
            >
              <div className="flex space-x-6">
                <StarIcon className="h-6 w-6 text-gray-700" />
                <span>Favorites</span>
              </div>
              <ChevronRightIcon className="h-5 w-5 text-gray-500" />
            </button>

            <button
              onClick={() => navigate("/YourActivity")} // You need to create this route
              className="flex justify-between w-full px-6 py-2 bg-gray-200 hover:bg-gray-300 transition"
            >
              <div className="flex space-x-6">
                <ClockIcon className="h-6 w-6 text-gray-700" />
                <span>Your Activity</span>
              </div>
              <ChevronRightIcon className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import logo from "./assets/logo.png";

const DealerNavBar = ({ isHomeDashboard }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dealerData = localStorage.getItem("dealer");
  const dealer = dealerData ? JSON.parse(dealerData) : null;

  const handleLogout = () => {
    localStorage.clear();
    navigate("/dealerLogin");
  };

  const handleAddCar = () => {
    navigate("/dealerUploadCars");
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-[#FAFAFA] border-b border-gray-200 z-50">
      <div className="flex justify-between items-center w-[90%] mx-auto h-16">
        {/* Logo */}
        <Link to="/dealerDashboard" className="flex items-center">
          <img src={logo} alt="Logo" className="h-12 w-auto" />
        </Link>

        {/* Right Side */}
        <div className="flex space-x-6 items-center">
          {isHomeDashboard && (
            <button
              onClick={handleAddCar}
              className="bg-purple-800 text-white px-5 py-2 rounded-lg hover:bg-purple-900 transition"
            >
              + Add Car
            </button>
          )}

          <h1 className="text-lg">Welcome, {dealer?.DealerName}</h1>

          {/* More Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1 px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 font-medium"
            >
              More
              <ChevronDown className="w-4 h-4" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50">
                <ul>
                  <li
                    onClick={() => navigate("/dealerProfile")}
                    className="px-4 py-3 hover:bg-purple-50 hover:text-purple-800 cursor-pointer"
                  >
                    Profile
                  </li>
                  <li
                    onClick={handleLogout}
                    className="px-4 py-3 hover:bg-purple-50 hover:text-purple-800 cursor-pointer"
                  >
                    Logout
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DealerNavBar;

import React, { useState, useEffect } from 'react';
import { ChevronDown } from "lucide-react"; // modern icon
import {useLocation} from "react-router-dom";
import logo from './assets/logo.png';
// import login from "./Login.jsx";
import {Link} from "react-router-dom";
import Carview from './Carview.jsx';

function NavBar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [category, setCategory] = useState("All"); // category filter

  const location = useLocation();
  const username = location.state?.email;
  console.log(username);
  const handleClickOutside = (e) => {
    if (
      !e.target.closest('.dropdown-container') && 
      !e.target.closest('.category-dropdown')
    ) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-[10%] bg-[#FAFAFA] border-b border-gray-200 z-50">
      <div className="flex justify-between items-center w-[90%] mx-auto h-full">
        
        {/* Logo */}
        <div className="flex items-center">
          <img className="h-12 w-auto" src={logo} alt="logoimg" />
        </div>

        {/* Unified Search Box */}
        <div className="flex items-center w-[40%] border border-gray-300 rounded-full overflow-hidden bg-white shadow-sm">
          
          {/* Custom Styled Category Dropdown */}
          <div className="relative flex items-center  px-3 cursor-pointer category-dropdown">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="appearance-none bg-transparent pr-6 focus:outline-none text-gray-700 font-medium cursor-pointer"
            >
              <option value="All">All</option>
              <option value="Used">Used</option>
              <option value="New">New</option>
            </select>
            <ChevronDown className="absolute right-1 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>

          {/* Search Input */}
          <input
            type="text"
            placeholder="Search"
            className="flex-1 h-10 px-4 focus:outline-none text-gray-700"
          />
        </div>

        {/* Links + More Dropdown */}
        <div className="flex items-center space-x-4">
          {username ? (
          // Show username instead of Login/Register
          <span className="text-gray-700 font-medium">Hello, {username}</span>
        ) : (
          <>
          <Link to="login">
            <button className="text-gray-700 hover:text-purple-700 font-medium">Login</button>
          </Link>
          <span className="text-gray-400">/</span>
          <Link to="Register">
            <button className="text-gray-700 hover:text-purple-700 font-medium">Register</button>
          </Link> </>)}
         

          <div className="relative dropdown-container">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 font-medium"
            >
              More
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                <ul className="py-2">
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Profile</li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Settings</li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Logout</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NavBar;

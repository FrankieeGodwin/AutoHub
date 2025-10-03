import React, { useState, useEffect } from 'react';
import { ChevronDown,Bell } from "lucide-react"; // modern icon
import {useLocation} from "react-router-dom";
import logo from './assets/logo.png';
// import login from "./Login.jsx";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
// import Carview from './Carview.jsx';


function NavBar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [category, setCategory] = useState("All"); // category filter
  const navigate=useNavigate();
  const location = useLocation();
  const user=JSON.parse(localStorage.getItem("user"));
  const userId = user?.userId;
  const username = user?.emailId;
  const fullName = user?.fullName;
  const [unreadCount, setUnreadCount] = useState(0);
  // const token = user?.token;
  const token = localStorage.getItem("token");
  const API_BASE = import.meta.env.VITE_API_BASE;
  console.log(token);
  console.log(userId)
//   useEffect(() => {
//   if (!token) {
//     // if no token/user → redirect immediately
//     localStorage.removeItem("user");
//     localStorage.removeItem("token");
//     navigate("/login");
//   }
// }, [token, navigate]);

//   useEffect(() => {

//   axios
//     .get(`${API_BASE}/users/${userId}`, {
//       headers: { Authorization: `Bearer ${token}` },
//     })
//     .then((res) => {
//       console.log("User still logged in:", username, userId);
//       // token is valid → do nothing
//     })
//     .catch((err) => {
//       console.error("Token invalid or expired:", err);
//       localStorage.removeItem("user");
//       localStorage.removeItem("token");
//       navigate("/login"); // ✅ now redirect works
//     });
// }, [userId, username, API_BASE, navigate]);

  useEffect(() => {
    if (user && token) {
      axios
        .get(`${API_BASE}/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
            console.log(username);
            console.log(userId);
          // valid token → set user info
        })
        .catch(() => {
          // token invalid/expired → clear local storage
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          setUser(null);
        });
    }
  }, []);
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

  const handleAddCar = ()=>{
    navigate("/Subscription");
  }



  // const [filters, setFilters] = useState({
  //   make: '',
  //   color: '',
  // });




  // const filteredCars = allCars.filter(car => {
  //   const makeMatch = filters.make === '' || car.make.toLowerCase().includes(filters.make.toLowerCase());
  //   const colorMatch = filters.color === '' || car.color.toLowerCase().includes(filters.color.toLowerCase());
  //   return makeMatch && colorMatch;
  // });


  //sathish

  const [cars, setCars] = useState([]);
  const [filters, setFilters] = useState({ make: "", color: "" });
  const [filteredCars, setFilteredCars] = useState([]);

  // Fetch cars from backend API
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await axios.get(`${API_BASE}/cars/`);
        setCars(res.data);   // store all cars
        setFilteredCars(res.data); // default view
      } catch (error) {
        console.error("Error fetching cars:", error);
      }
    };
    fetchCars();
  }, []);

  // Handle filter input changes
  // const handleFilterChanges = (e) => {
  //   const { name, value } = e.target;
  //   setFilters((prev) => ({ ...prev, [name]: value }));
  // };

  // Filter cars when filters or cars change
  useEffect(() => {
    if (!filters.make && !filters.color) {
      setFilteredCars(cars);
      return;
    }
    let updatedCars = cars;

    if (filters.make) {
      updatedCars = updatedCars.filter((car) =>
        car.make.toLowerCase().includes(filters.make.toLowerCase())
      );
    }

    if (filters.color) {
      updatedCars = updatedCars.filter((car) =>
        car.color?.toLowerCase().includes(filters.color.toLowerCase())
      );
    }

    setFilteredCars(updatedCars);
  }, [filters, cars]);


  useEffect(() => {
    if (!userId) return;
  const fetchUnread = async () => {
      try {
        const res = await axios.get(`${API_BASE}/SellerNotification/checkview/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUnreadCount(res.data.count || 0);
      } catch (err) {
        console.error("Error fetching unread notifications:", err);
      }
    };

    fetchUnread();
  }, [userId]);

  return (
    <div className="fixed top-0 left-0 w-full h-[10%] bg-[#FAFAFA] border-b border-gray-200 z-50">
      <div className="flex justify-between items-center w-[90%] mx-auto h-full">
        <Link to="/" className="text-sm text-gray-600 hover:text-gray-900">
        <div className="flex items-center">
          <img className="h-12 w-auto" src={logo} alt="logoimg" />
        </div>
        </Link>
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
        {username && (
          <div className="w-[10%]">
            <button
              onClick={handleAddCar}
              className="bg-purple-800 text-white hover:bg-purple-900 p-[4%] rounded w-[80%]"
            >
              Sell Your Car
            </button>
          </div>
        )}

<div className="relative">
  <button 
    className="p-2 rounded relative" 
    onClick={() => navigate("/Notifications")}
  >
    <Bell className="w-5 h-5 text-gray-600 hover:text-purple-800 cursor-pointer" />

    {/* 🔴 Red dot */}
    {unreadCount > 0 && (
      <span className="absolute top-2 right-2 w-2 h-2 bg-red-600 rounded-full"></span>
    )}
  </button>

  {/* 🟣 Tooltip below the bell */}
  {unreadCount > 0 && (
    <div className="absolute top-8 right-0 bg-purple-800 text-white text-xs px-3 py-1 rounded-lg shadow-lg">
      New Notification
      {/* Arrow made with rotated square */}
      <div className="absolute -top-1 right-3 w-2 h-2 bg-purple-800 rotate-45"></div>
    </div>
  )}
</div>



        {/* Links + More Dropdown */}
        <div className="flex items-center space-x-4">
          {username ? (
          // Show username instead of Login/Register
          <span className="text-gray-700 font-medium">Hello, {fullName}</span>
        ) : (
          <>
          <Link to="login">
            <button className="text-gray-700 hover:text-purple-800 font-medium">Login</button>
          </Link>
          <span className="text-gray-400">/</span>
          <Link to="Register">
            <button className="text-gray-700 hover:text-purple-800 font-medium">Register</button>
          </Link> </>)}
         

          {username &&(<div className="relative dropdown-container">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 font-medium"
            >
              More
            </button>

          {dropdownOpen && (
  <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-fade-in">
    <ul className="py-2 mx-5">
      <li
        onClick={() => navigate("/Profile")}
        className="px-3 py-3 hover:bg-purple-50 hover:text-purple-800 cursor-pointer transition-colors duration-200"
      >
        Profile
      </li>
      <li
        onClick={() => navigate("/Settings")}
        className="px-3 py-3 hover:bg-purple-50 hover:text-purple-800 cursor-pointer transition-colors duration-200"
      >
        Settings
      </li>
      <li
        onClick={() => {
          localStorage.removeItem("user");
          localStorage.removeItem("token");

          navigate("/");
        }}
        className="px-3 py-3 hover:bg-purple-50 hover:text-purple-800 cursor-pointer transition-colors duration-200"
      >
        Logout
      </li>
    </ul>
  </div>
)}




          </div>
            )}
        </div>
      </div>



      
      




    </div>
  );
}

export default NavBar;

import React, { useState, useEffect } from 'react';
import { ChevronDown } from "lucide-react"; // modern icon
import {useLocation} from "react-router-dom";
import logo from './assets/logo.png';
// import login from "./Login.jsx";
import {Link, useNavigate} from "react-router-dom";
import Carview from './Carview.jsx';

const allCars = [
  { id: 1, make: 'Toyota', model: 'Camry', color: 'red' },
  { id: 2, make: 'Honda', model: 'Accord', color: 'blue' },
  { id: 3, make: 'Ford', model: 'Fusion', color: 'black' },
  { id: 4, make: 'Toyota', model: 'Corolla', color: 'white' },
  { id: 5, make: 'Ford', model: 'Mustang', color: 'red' },
  { id: 6, make: 'Honda', model: 'Civic', color: 'blue' },
  { id: 7, make: 'Tesla', model: 'Model 3', color: 'white' },
];

function NavBar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [category, setCategory] = useState("All"); // category filter
  const navigate=useNavigate();
  const location = useLocation();
  const username = location.state?.email;
  const userId = location.state?.id;
  console.log(username);
  const handleClickOutside = (e) => {
    if (
      !e.target.closest('.dropdown-container') && 
      !e.target.closest('.category-dropdown')
    ) {
      setDropdownOpen(false);
    }
  };
  const handleAddCar = ()=>{
    navigate("/addCar", {state : {id : userId}})
  }
  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);


  const [filters, setFilters] = useState({
    make: '',
    color: '',
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const filteredCars = allCars.filter(car => {
    const makeMatch = filters.make === '' || car.make.toLowerCase().includes(filters.make.toLowerCase());
    const colorMatch = filters.color === '' || car.color.toLowerCase().includes(filters.color.toLowerCase());
    return makeMatch && colorMatch;
  });


  return (
    <div className="fixed top-0 left-0 w-full h-[10%] bg-[#FAFAFA] border-b border-gray-200 z-50">
      <div className="flex justify-between items-center w-[90%] mx-auto h-full">
        
        <div className="flex items-center">
          <img className="h-12 w-auto" src={logo} alt="logoimg" />
        </div>

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
        <div className='w-[10%]'>
          <button onClick={handleAddCar}
            className="bg-purple-700 text-white hover:bg-purple-800 p-[4%] rounded w-[80%]"
          >
            Add Car
          </button>     
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



      
      <div className="container mx-auto p-4">
      <h1 className="text-black-500 text-2xl font-bold mb-6">Cars</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Side: Filter Panel */}
        <div className="w-full lg:w-1/4 p-6 bg-gray-100 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Filters</h2>
          <div className="mb-4">
            <label htmlFor="make" className="block text-gray-700 font-medium mb-1">Make</label>
            <input
              type="text"
              id="make"
              name="make"
              value={filters.make}
              onChange={handleFilterChange}
              placeholder="e.g., Toyota"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="color" className="block text-gray-700 font-medium mb-1">Color</label>
            <input
              type="text"
              id="color"
              name="color"
              value={filters.color}
              onChange={handleFilterChange}
              placeholder="e.g., red"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Right Side: Car View */}
        <div className="w-full lg:w-3/4">
          {filteredCars.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredCars.map(car => (
                <div key={car.id} className="p-6 bg-white rounded-lg shadow-md text-center">
                  <h3 className="text-lg font-semibold mb-1">{car.make} {car.model}</h3>
                  <p className="text-gray-600">Color: {car.color}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 text-lg">No cars found matching your filters.</p>
          )}
        </div>
      </div>
    </div>





    </div>
  );
}

export default NavBar;

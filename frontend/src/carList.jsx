import React, { useState, useEffect } from 'react';
import { ChevronDown } from "lucide-react"; // modern icon
import {useLocation} from "react-router-dom";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
export default function CarList(){
    const navigate=useNavigate();
    const location = useLocation();
    const user=JSON.parse(localStorage.getItem("user"));
    const email =user?.emailId;
    const userId = user?.userId;
    const API_BASE = import.meta.env.VITE_API_BASE;
    const handleClickCar = (carId,model)=>{
    navigate("/carView", { state: {carId:carId, model:model}});
  }
  const handleFilterChange = (e) => {
  const { name, value } = e.target;
  setFilters((prev) => ({ ...prev, [name]: value }));
  };
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
    return(
      <div className="mx-auto p-4 mt-[5%] z-50 bg-[#FAFAFA]">
      <h1 className="text-center text-black-500 text-2xl font-bold mb-6">Cars</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Side: Filter Panel */}
        <div className="w-1/4 p-6 bg-white mt-[5%] rounded-lg shadow-md h-screen fixed top-[5%] left-0">
          <h2 className="text-xl font-semibold mb-4">Filters</h2>
          <div className="mb-4">
            <label
              htmlFor="make"
              className="block text-gray-700 font-medium mb-1"
            >
              Make
            </label>
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
            <label
              htmlFor="color"
              className="block text-gray-700 font-medium mb-1"
            >
              Color
            </label>
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
        <div className="w-full lg:w-3/4 ml-[25%]">
          {filteredCars.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredCars.map((car) => (
                car.userId !== userId ? (
                  <div
                    key={car._id}
                    onClick={() => handleClickCar(car.carId, car.model)}
                    className="p-6 bg-white rounded-lg shadow-md text-center transform transition-transform duration-200 ease-in-out hover:scale-105"
                  >
                    <h3 className="text-lg font-semibold mb-1">
                      {car.make} {car.model}
                    </h3>
                    <img 
                      src={car.images && car.images.length > 0 ? car.images[0].imageURL : "/placeholder.jpg"} 
                      alt="Car" 
                      className="w-full h-48 object-cover rounded-md"
                    />
                    <p className="text-gray-600">Color: {car.features.color}</p>
                    <p className="text-gray-600">Price: ₹{car.price}</p>
                    <p className="text-gray-600">Status: {car.status}</p>
                    <p className="text-gray-600">Reg No: {car.regno}</p>
                  </div>
                ) : null
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 text-lg">
              No cars found matching your filters.
            </p>
          )}
        </div>
      </div>
    </div>
    )
}
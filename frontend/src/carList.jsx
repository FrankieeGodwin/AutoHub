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
  const [filters, setFilters] = useState({ make: "", color: "", engine: "", price:"" ,year: "", transmission: "", fuel: "" });
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
  const updatedCars = cars.filter((car) => {
    const matchesMake =
      !filters.make ||
      car.make?.toLowerCase().includes(filters.make.toLowerCase());

    const matchesColor =
      !filters.color ||
      (car.features?.color || "").toLowerCase() ===
        filters.color.toLowerCase();

    const matchesEngine =
      !filters.engine ||
      (car.features?.engine || "").toLowerCase() ===
        filters.engine.toLowerCase();

    const matchesYear =
      !filters.year ||
      String(car.features?.yearOfManufacture || car.manufactureYear || "") ===
        filters.year;

    const matchesTransmission =
      !filters.transmission ||
      (car.features?.transmission || "").toLowerCase() ===
        filters.transmission.toLowerCase();

    const matchesFuel =
      !filters.fuel ||
      (car.features?.fuelType || "").toLowerCase() ===
        filters.fuel.toLowerCase();

    // Price Range
    let matchesPrice = true;
    if (filters.price) {
      if (filters.price.includes("-")) {
        const [min, max] = filters.price.split("-").map(Number);
        matchesPrice = car.price >= min && car.price <= max;
      } else {
        matchesPrice = car.price >= Number(filters.price);
      }
    }

    return (
      matchesMake &&
      matchesColor &&
      matchesEngine &&
      matchesYear &&
      matchesTransmission &&
      matchesFuel &&
      matchesPrice
    );
  });

  setFilteredCars(updatedCars);
}, [filters, cars]);


    return(
      <div className="mx-auto p-4 mt-[5%] z-50 bg-[#FAFAFA]">
      <h1 className="text-center text-black-500 text-2xl font-bold mb-6">Cars</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Side: Filter Panel */}
        <div className="hidden lg:block w-1/4 p-6 bg-white rounded-xl shadow-md max-h-[85vh] overflow-y-auto border border-gray-100 sticky top-[6rem]">
          <h2 className="text-xl font-bold mb-6 text-gray-800">Filters</h2>

{/* Make Filter */}
<div className="mb-6">
  <label htmlFor="make" className="block text-gray-600 font-medium mb-2">
    Make
  </label>
  <input
    type="text"
    id="make"
    name="make"
    value={filters.make}
    onChange={handleFilterChange}
    placeholder="e.g., Toyota"
    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
  />
</div>

{/* Color Filter */}
<div className="mb-6">
  <label htmlFor="color" className="block text-gray-600 font-medium mb-2">
    Color
  </label>
  <select
    id="color"
    name="color"
    value={filters.color}
    onChange={handleFilterChange}
    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
  >
    <option value="">All</option>
    <option value="White">White</option>
    <option value="Black">Black</option>
    <option value="Silver / Grey">Silver / Grey</option>
    <option value="Blue">Blue</option>
    <option value="Red">Red</option>
    <option value="Green">Green</option>
    <option value="Brown">Brown</option>
    <option value="Yellow / Gold">Yellow / Gold</option>
    <option value="Orange">Orange</option>
    <option value="Maroon">Maroon</option>
    <option value="Custom / Other">Custom / Other</option>
  </select>
</div>

{/* Engine Filter */}
<div className="mb-6">
  <label htmlFor="engine" className="block text-gray-600 font-medium mb-2">
    Engine
  </label>
  <select
    id="engine"
    name="engine"
    value={filters.engine}
    onChange={handleFilterChange}
    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
  >
    <option value="">All</option>
    <option value="800 cc">800 cc</option>
    <option value="1000 cc">1000 cc</option>
    <option value="1200 cc">1200 cc</option>
    <option value="1400 cc">1400 cc</option>
    <option value="1500 cc">1500 cc</option>
    <option value="1600 cc">1600 cc</option>
    <option value="1800 cc">1800 cc</option>
    <option value="2000 cc">2000 cc</option>
    <option value="2200 cc">2200 cc</option>
    <option value="2500 cc+">2500 cc+</option>
  </select>
</div>

{/* Price Filter */}
<div className="mb-6">
  <label htmlFor="price" className="block text-gray-600 font-medium mb-2">
    Price
  </label>
  <select
    id="price"
    name="price"
    value={filters.price}
    onChange={handleFilterChange}
    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
  >
    <option value="">All</option>
    <option value="0-500000">Below ₹5L</option>
    <option value="500001-1000000">₹5L - ₹10L</option>
    <option value="1000001-2000000">₹10L - ₹20L</option>
    <option value="2000001">Above ₹20L</option>
  </select>
</div>

{/* Manufacture Year Filter */}
<div className="mb-6">
  <label htmlFor="year" className="block text-gray-600 font-medium mb-2">
    Manufacture Year
  </label>
  <select
    id="year"
    name="year"
    value={filters.year}
    onChange={handleFilterChange}
    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
  >
    <option value="">All</option>
    {Array.from({ length: 26 }, (_, i) => (2000 + i).toString()).map((yr) => (
      <option key={yr} value={yr}>
        {yr}
      </option>
    ))}
  </select>
</div>

{/* Transmission Filter */}
<div className="mb-6">
  <label htmlFor="transmission" className="block text-gray-600 font-medium mb-2">
    Transmission
  </label>
  <select
    id="transmission"
    name="transmission"
    value={filters.transmission}
    onChange={handleFilterChange}
    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
  >
    <option value="">All</option>
    <option value="Manual">Manual</option>
    <option value="Automatic">Automatic</option>
    <option value="CVT">CVT</option>
    <option value="Semi-Automatic">Semi-Automatic</option>
  </select>
</div>

{/* Fuel Type Filter */}
<div className="mb-6">
  <label htmlFor="fuel" className="block text-gray-600 font-medium mb-2">
    Fuel Type
  </label>
  <select
    id="fuel"
    name="fuel"
    value={filters.fuel}
    onChange={handleFilterChange}
    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
  >
    <option value="">All</option>
    <option value="Petrol">Petrol</option>
    <option value="Diesel">Diesel</option>
    <option value="CNG">CNG</option>
    <option value="Electric">Electric</option>
    <option value="Hybrid">Hybrid</option>
  </select>
</div>

{/* Reset Button */}
<button
  type="button"
  onClick={() =>
    setFilters({
      make: "",
      color: "",
      engine: "",
      price: "",
      year: "",
      transmission: "",
      fuel: "",
    })
  }
  className="w-full bg-purple-600 text-white py-2 rounded-lg shadow hover:bg-purple-700 transition"
>
  Reset Filters
</button>
</div>




        {/* Right Side: Car View */}
        <div className="w-full lg:w-3/4">
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
                    {/* <p className="text-gray-600">Status: {car.status}</p> */}
                    {/* <p className="text-gray-600">Reg No: {car.regno}</p> */}
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


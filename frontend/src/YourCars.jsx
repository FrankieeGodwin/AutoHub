import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { StarIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import NavBarBasic from "./NavBarBasic";
import Footer from "./Footer";

export default function YourCars() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.userId;
  const token = user?.token;
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_BASE = import.meta.env.VITE_API_BASE;

  useEffect(() => {
    if (!userId) return;

    const fetchUserCars = async () => {
      try {
        const allCarsRes = await axios.get(
          `${API_BASE}/cars/getByUserId/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCars(allCarsRes.data);
      } catch (err) {
        console.error("Error fetching user's cars:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserCars();
  }, [userId]);

  if (loading)
    return <p className="text-center mt-10 text-lg">Loading your cars...</p>;

  if (cars.length === 0)
    return <p className="text-center mt-10 text-lg">No cars found for you.</p>;

  return (
    <div className="container mx-auto p-6">
      <NavBarBasic />
      <div className="container mx-auto p-6 mt-20">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
         Your Cars
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cars.map((car) => (
            <div
              key={car.carId}
              onClick={() => handleClickCar(car.carId, car.model)}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transform transition-all duration-300 hover:scale-105 cursor-pointer overflow-hidden border border-gray-100"
            >
              <img
                src={car.images?.[0]?.imageURL || "/placeholder.jpg"}
                alt={car.model}
                className="w-full h-48 object-cover rounded-t-2xl"
              />
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {car.features?.yearOfManufacture} {car.make} {car.model}{" "}
                  <span className="text-gray-500 text-sm">
                    {car.features?.engine}
                  </span>
                </h3>

                {/* Info badges */}
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                    {car.carDetails?.distanceTravelled} kms
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                    {car.features?.fuelType}
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                    {car.features?.transmission}
                  </span>
                </div>

                {/* Price */}
                <p className="text-xl font-bold text-purple-700 mb-3">
                  ₹{(car.price / 100000).toLocaleString()} Lakhs
                </p>

                <hr className="border-t border-gray-200 my-3" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

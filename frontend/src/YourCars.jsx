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
        const allCarsRes = await axios.get(`${API_BASE}/cars/getByUserId/${userId}`,{
          headers: { Authorization: `Bearer ${token}` },
        });
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.map((car) => (
          <div
            key={car.carId}
            onClick={() => handleClickCar(car.carId, car.model)}
            className="bg-white rounded-2xl shadow-md transform transition-transform duration-200 hover:scale-105"
          >
            <img
              src={car.images?.[0]?.imageURL || "/placeholder.jpg"}
              alt={car.model}
              className="w-full h-48 object-cover rounded-2xl"
            />
            <div className="p-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold mb-1">
                  {car.features?.yearOfManufacture} {car.make} {car.model}{" "}
                  {car.features?.engine}
                </h3>
              </div>
              <p className="text-gray-600">
                {car.carDetails?.distanceTravelled} kms -{" "}
                {car.features?.fuelType} - {car.features?.transmission}
              </p>
              <p className="text-xl font-bold mb-1">
                ₹{car.price / 100000} Lakhs
              </p>
              <hr className="border-t-2 border-gray-300 my-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


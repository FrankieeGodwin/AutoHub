import React, { useEffect, useState } from "react";
import axios from "axios";
import { StarIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";

export default function Favorites() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.userId;
  const token = user?.token;
  const API_BASE = import.meta.env.VITE_API_BASE;

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch favorites directly (no need to fetch all cars)
  useEffect(() => {
  const fetchFavorites = async () => {
    try {
      // 1. Get user favorites
      const userRes = await axios.get(
        `${API_BASE}/users/userDetails/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const favoriteCars = userRes.data?.data?.favorites || [];
      console.log("Favorite Cars (initial):", favoriteCars);

      // 2. Fetch details for each car
      const enrichedCars = await Promise.all(
        favoriteCars.map(async (car) => {
          try {
            const carId = car._id;

            const [mainRes, featuresRes, detailsRes, imagesRes, locationRes] =
              await Promise.all([
                axios.get(`${API_BASE}/cars/main/${carId}`, {
                  headers: { Authorization: `Bearer ${token}` },
                }),
                axios.get(`${API_BASE}/cars/features/${carId}`, {
                  headers: { Authorization: `Bearer ${token}` },
                }),
                axios.get(`${API_BASE}/cars/details/${carId}`, {
                  headers: { Authorization: `Bearer ${token}` },
                }),
                axios.get(`${API_BASE}/cars/images/${carId}`, {
                  headers: { Authorization: `Bearer ${token}` },
                }),
                axios.get(`${API_BASE}/cars/location/${carId}`, {
                  headers: { Authorization: `Bearer ${token}` },
                }),
              ]);

            return {
              ...car, // keep the existing fields
              ...mainRes.data, // merge main info
              features: featuresRes.data,
              carDetails: detailsRes.data,
              images: imagesRes.data,
              location: locationRes.data,
            };
          } catch (error) {
            console.error(`Error fetching details for car ${car._id}:`, error);
            return car; // fallback to the base car object
          }
        })
      );

      console.log("Enriched Favorite Cars:", enrichedCars);
      setFavorites(enrichedCars);
    } catch (err) {
      console.error("Error fetching favorites:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchFavorites();
}, [userId, token]);


  const handleRemoveFromFavorites = async (carId) => {
    try {
      setFavorites((prev) => prev.filter((fav) => fav._id !== carId));

      await axios.post(
        `${API_BASE}/users/removeFavorite`,
        { carId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Removed from favorites:", carId);
    } catch (err) {
      console.error("Error removing favorite:", err);
    }
  };

  const handleClickCar = (carId, model) => {
    navigate("/carView", { state: { carId, model } });
  };

  if (loading) {
    return (
      <div className="text-center mt-10 text-gray-500">
        Loading favorite cars...
      </div>
    );
  }

  if (!favorites.length) {
    return (
      <div className="text-center mt-10 text-gray-500">
        No favorite cars found.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((car) => (
          <div
            key={car._id}
            onClick={() => handleClickCar(car._id, car.model)}
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
                <StarIcon
                  className="h-6 w-6 cursor-pointer text-yellow-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFromFavorites(car._id);
                  }}
                />
              </div>
              <p className="text-gray-600">
                {car.carDetails?.distanceTravelled} kms -{" "}
                {car.features?.fuelType} - {car.features?.transmission}
              </p>
              <p className="text-xl font-bold mb-1">
                ₹{car.price / 100000} Lakhs
              </p>
              <hr className="border-t-2 border-gray-300 my-4" />
              <button
                onClick={() => handleClickCar(car._id, car.model)}
                className="bg-purple-600 hover:bg-purple-700 p-2 w-full rounded-xl text-white"
              >
                View Car Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

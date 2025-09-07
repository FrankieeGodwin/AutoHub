import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function YourCars() {
  const location = useLocation();
  const navigate = useNavigate();
  const userId = location.state?.userId;

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_BASE = import.meta.env.VITE_API_BASE;

  useEffect(() => {
    if (!userId) return;

    const fetchUserCars = async () => {
      try {
        // 1. Get all cars
        const allCarsRes = await axios.get(`${API_BASE}/cars/all`);
        const userCars = allCarsRes.data.filter((car) => car.userId == userId);

        // 2. For each car, fetch features, details, images, location
        const carsWithData = await Promise.all(
          userCars.map(async (car) => {
            const [featuresRes, detailsRes, imagesRes, locationRes] =
              await Promise.all([
                axios.get(`${API_BASE}/cars/features/${car._id}`),
                axios.get(`${API_BASE}/cars/details/${car._id}`),
                axios.get(`${API_BASE}/cars/images/${car._id}`),
                axios.get(`${API_BASE}/cars/location/${car._id}`),
              ]);

            return {
              ...car,
              features: featuresRes.data,
              details: detailsRes.data,
              images: imagesRes.data,
              locationData: locationRes.data,
            };
          })
        );

        setCars(carsWithData);
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
    <div className="min-h-screen bg-purple-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-purple-800 mb-8 text-center">
          Your Cars
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <div
              key={car._id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              {/* Car image */}
              {car.images && car.images.length > 0 ? (
                <img
                  src={car.images[0].imageURL}
                  alt={`${car.make} ${car.model}`}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <p className="text-gray-500 text-center py-20">
                  No image available
                </p>
              )}

              {/* Car info */}
              <div className="p-4">
                <h2 className="text-xl font-semibold text-purple-700">
                  {car.make} {car.model}
                </h2>
                <p className="text-gray-700">Price: ₹{car.price}</p>
                <p className="text-gray-700">
                  Status:{" "}
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      car.status === "Available"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {car.status}
                  </span>
                </p>
                <p className="text-gray-700">Reg No: {car.regno}</p>

                {/* Features summary */}
                {car.features && (
                  <p className="text-gray-600 mt-2 text-sm">
                    Engine: {car.features.engine}, Fuel: {car.features.fuelType},{" "}
                    Transmission: {car.features.transmission}
                  </p>
                )}

                {/* Button to view car details */}
                <button
                  onClick={() =>
                    navigate("/carview", {
                      state: { userId, carId: car._id },
                    })
                  }
                  className="mt-4 w-full bg-purple-700 text-white py-2 rounded-lg hover:bg-purple-800 transition"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


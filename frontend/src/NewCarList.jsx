import React, { useEffect, useState } from "react";
import axios from "axios";

const NewCarList = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/newcars/all-cars");
        setCars(res.data.car || []); // backend sends { success, totalCars, cars }
      } catch (err) {
        console.error("Error fetching cars:", err);
        setError("Failed to load cars");
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  if (loading) return <p className="text-center mt-5 text-gray-600">Loading cars...</p>;
  if (error) return <p className="text-center mt-5 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">All New Cars</h2>

      {cars.length === 0 ? (
        <p className="text-center text-gray-600">No cars available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <div
              key={car._id}
              className="bg-white rounded-2xl shadow-md p-4 hover:shadow-lg transition-all"
            >
              {/* Car Image */}
              {car.media?.images?.length > 0 && (
                <img
                  src={car.media.images[0]}
                  alt={`${car.brand} ${car.modelName}`}
                  className="w-full h-48 object-cover rounded-xl mb-3"
                />
              )}

              {/* Car Details */}
              <h3 className="text-lg font-semibold text-gray-800">
                {car.brand} {car.modelName}
              </h3>
              <p className="text-sm text-gray-500 mb-1">Variant: {car.variant}</p>
              <p className="text-sm text-gray-500 mb-1">Body Type: {car.bodyType || "N/A"}</p>
              <p className="text-sm text-gray-600 mb-2">
                Fuel: {car.fuelTypes?.join(", ") || "N/A"}
              </p>

              {/* Price Range */}
              <p className="font-bold text-blue-600">
                ₹{car.priceRange?.min?.toLocaleString()} - ₹{car.priceRange?.max?.toLocaleString()}
              </p>

              {/* Stock */}
              <p className="text-sm text-gray-500 mt-1">Stock: {car.stock}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewCarList;

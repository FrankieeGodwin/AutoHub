import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

function CarView() {
  const location = useLocation();
  const userId = location.state?.userId;
  const carId = location.state?.carId;

  const [car, setCar] = useState(null);
  const [features, setFeatures] = useState(null);
  const [details, setDetails] = useState(null);
  const [images, setImages] = useState([]);
  const [locationData, setLocationData] = useState(null);

  const API_BASE = import.meta.env.VITE_API_BASE;

  useEffect(() => {
    if (!carId) return;

    const fetchCarData = async () => {
      try {
        const [mainRes, featuresRes, detailsRes, imagesRes, locationRes] =
          await Promise.all([
            axios.get(`${API_BASE}/cars/main/${carId}`),
            axios.get(`${API_BASE}/cars/features/${carId}`),
            axios.get(`${API_BASE}/cars/details/${carId}`),
            axios.get(`${API_BASE}/cars/images/${carId}`),
            axios.get(`${API_BASE}/cars/location/${carId}`),
          ]);

        setCar(mainRes.data);
        setFeatures(featuresRes.data);
        setDetails(detailsRes.data);
        setImages(imagesRes.data);
        setLocationData(locationRes.data);
      } catch (err) {
        console.error("Error fetching car data:", err);
      }
    };

    fetchCarData();
  }, [carId]);

  if (!car) return <p className="text-center mt-10">Loading car details...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-6">
        {car.make} {car.model}
      </h1>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* LEFT SIDE: Images + Details */}
        <div>
          {/* Main Image */}
          {images.length > 0 ? (
            <img
              src={images[0].imageURL}
              alt="Main Car"
              className="w-full h-72 object-cover rounded-lg shadow-md mb-4"
            />
          ) : (
            <p>No images available</p>
          )}

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="grid grid-cols-3 gap-3 mb-6">
              {images.slice(1).map((img, index) => (
                <img
                  key={index}
                  src={img.imageURL}
                  alt={`Car ${index + 1}`}
                  className="w-full h-24 object-cover rounded-md shadow-sm hover:scale-105 transition"
                />
              ))}
            </div>
          )}

          {/* Main Car Info */}
          <div className="mb-4">
            <p className="text-gray-700">
              <strong>Price:</strong> ₹{car.price}
            </p>
            <p className="text-gray-700">
              <strong>Status:</strong> {car.status}
            </p>
            <p className="text-gray-700">
              <strong>Registration No:</strong> {car.regno}
            </p>
          </div>

          {/* Features */}
          {features && (
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-2">Features</h2>
              <ul className="space-y-1 text-gray-700">
                <li>Engine: {features.engine}</li>
                <li>Mileage: {features.mileage}</li>
                <li>Fuel Type: {features.fuelType}</li>
                <li>Transmission: {features.transmission}</li>
                <li>Seating Capacity: {features.seatingCapacity}</li>
                <li>Body Type: {features.bodyType}</li>
                <li>Color: {features.color}</li>
                <li>Year: {features.yearOfManufacture}</li>
                <li>Drive Type: {features.driveType}</li>
              </ul>
            </div>
          )}

          {/* Car Details */}
          {details && (
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-2">Car Details</h2>
              <ul className="space-y-1 text-gray-700">
                <li>Age: {details.age} years</li>
                <li>Distance Travelled: {details.distanceTravelled} km</li>
                <li>Number of Owners: {details.numberOfOwners}</li>
              </ul>
            </div>
          )}

          {/* Location */}
          {locationData && (
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-2">Location</h2>
              <ul className="space-y-1 text-gray-700">
                <li>Country: {locationData.country}</li>
                <li>State: {locationData.state}</li>
                <li>City: {locationData.city}</li>
              </ul>
            </div>
          )}
        </div>

        {/* RIGHT SIDE: Reserved for future (Seller Info, Contact, Loan, etc.) */}
        <div className="p-6 bg-gray-50 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Seller Information</h2>
          <p className="text-gray-600 mb-2">Contact the seller for more details.</p>
          <button className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800">
            Contact Seller
          </button>

          {/* Hidden User ID */}
          <p className="text-sm text-gray-400 mt-6">User ID: {userId}</p>
        </div>
      </div>
    </div>
  );
}

export default CarView;

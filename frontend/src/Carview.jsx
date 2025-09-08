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

  const [user,setUser] = useState(null);
  const [showDetails,setShowDetails] = useState(false);
  const API_BASE = import.meta.env.VITE_API_BASE;

  const [currentIndex, setCurrentIndex] = useState(0);

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

        if (imagesRes.data.length > 0) {
          setCurrentIndex(0);
        }
      } catch (err) {
        console.error("Error fetching car data:", err);
      }
    };

    fetchCarData();
  }, [carId]);

  // Auto slideshow
  useEffect(() => {
    if (images.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // 3 sec interval

    return () => clearInterval(interval);
  }, [images]);

  useEffect(() => {
    if(!userId){
      alert("User id not found");
      return;
    }
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_BASE}/users/${car.userId}`)
        setUser(res.data);
      }
      catch (err) {
        console.error("Error fetching user data :",err);
      }
    };
    fetchUser();
  },[car,API_BASE]);

  if (!car)
    return (
      <p className="text-center mt-10 text-lg">Loading car details...</p>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-white to-purple-50 py-10 px-4">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden p-6 md:p-10">
        {/* Title */}
        <h1 className="text-3xl font-extrabold text-purple-800 mb-8 text-center">
          {car.make} {car.model}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* LEFT SIDE */}
          <div>
            {/* Main Image */}
            {images.length > 0 ? (
              <img
                src={images[currentIndex].imageURL}
                alt="Car Preview"
                className="w-full h-80 object-cover rounded-2xl shadow-lg mb-4 transition duration-700 ease-in-out"
              />
            ) : (
              <p className="text-gray-500">No images available</p>
            )}

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, index) => (
                  <img
                    key={index}
                    src={img.imageURL}
                    alt={`Thumbnail ${index + 1}`}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-28 h-20 object-cover rounded-lg shadow cursor-pointer transition hover:scale-105 ${
                      currentIndex === index
                        ? "ring-4 ring-purple-500"
                        : ""
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Price & Status */}
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mt-6 shadow-inner">
              <p className="text-gray-800 text-lg">
                <strong>Price:</strong> ₹{car.price}
              </p>
              <p className="text-gray-700">
                <strong>Status:</strong>{" "}
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    car.status === "Available"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {car.status}
                </span>
              </p>
              <p className="text-gray-700">
                <strong>Registration No:</strong> {car.regno}
              </p>
            </div>

            {/* Features */}
            {features && (
              <div className="mt-6">
                <h2 className="text-xl font-semibold text-purple-700 mb-3">
                  Features
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 p-3 rounded-lg shadow-sm">
                    Engine: {features.engine}
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg shadow-sm">
                    Mileage: {features.mileage}
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg shadow-sm">
                    Fuel: {features.fuelType}
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg shadow-sm">
                    Transmission: {features.transmission}
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg shadow-sm">
                    Seats: {features.seatingCapacity}
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg shadow-sm">
                    Body: {features.bodyType}
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg shadow-sm">
                    Color: {features.color}
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg shadow-sm">
                    Year: {features.yearOfManufacture}
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg shadow-sm">
                    Drive: {features.driveType}
                  </div>
                </div>
              </div>
            )}

            {/* Car Details */}
            {details && (
              <div className="mt-6">
                <h2 className="text-xl font-semibold text-purple-700 mb-3">
                  Car Details
                </h2>
                <div className="flex flex-col gap-2">
                  <div className="bg-gray-50 p-3 rounded-lg shadow-sm">
                    Age: {details.age} years
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg shadow-sm">
                    Distance: {details.distanceTravelled} km
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg shadow-sm">
                    Owners: {details.numberOfOwners}
                  </div>
                </div>
              </div>
            )}

            {/* Location */}
            {locationData && (
              <div className="mt-6">
                <h2 className="text-xl font-semibold text-purple-700 mb-3">
                  Location
                </h2>
                <div className="flex flex-col gap-2">
                  <div className="bg-gray-50 p-3 rounded-lg shadow-sm">
                    Country: {locationData.country}
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg shadow-sm">
                    State: {locationData.state}
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg shadow-sm">
                    City: {locationData.city}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT SIDE */}
          <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl shadow-lg flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold text-purple-800 mb-4">
                Seller Information
              </h2>
              <p className="text-gray-600 mb-6">
                Contact the seller for more details about this car.
              </p>

          
              <button onClick={() => {setShowDetails(!showDetails)}}
                className="w-full bg-purple-700 text-white py-3 rounded-lg shadow-md transition transform hover:scale-105 hover:bg-purple-800">
                Contact Seller
              </button>

              {showDetails && (
                <div className="mt-6 bg-white rounded-xl shadow-md p-5 border border-purple-200 transition-all duration-300">
                  <h3 className="text-lg font-semibold text-purple-700 mb-3">
                    Seller Contact Details
                  </h3>
                  <p className="text-gray-800 mb-2">
                    <span className="font-medium">Name:</span> {user.fullName}
                  </p>
                  <p className="text-gray-800 mb-2">
                    <span className="font-medium">Phone:</span> {user.phoneNo}
                  </p>
                  <p className="text-gray-800">
                    <span className="font-medium">Email:</span> {user.emailId}
                  </p>
                </div>
              )}

            </div>
            <p className="text-sm text-gray-400 mt-8 text-center">
              User ID: {car.userId}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CarView;

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import NavBarBasic from "./NavBarBasic";
import Footer from "./Footer";

function CarView() {
  const location = useLocation();
  const navigate = useNavigate();
  const users = JSON.parse(localStorage.getItem("user") || "null");
  const userId = users?.userId || "null";
  const email = users?.emailId || "null";
  const token = users?.token || "null";
  const carId = location.state?.carId;
  const paymentId = location.state?.paymentId;

  const [car, setCar] = useState(null);
  const [features, setFeatures] = useState(null);
  const [details, setDetails] = useState(null);
  const [images, setImages] = useState([]);
  const [locationData, setLocationData] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
const [loadingRecommendations, setLoadingRecommendations] = useState(false);


  const [user, setUser] = useState(null);
  const [paymentDone, setPaymentDone] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const API_BASE = import.meta.env.VITE_API_BASE;

  const [currentIndex, setCurrentIndex] = useState(0);

  function handlepayment() {
    if (userId === "null" || email === "null" || token === "null") {
      alert("Please login to make payment");
      navigate("/Login");
      return;
    }
    navigate("/Payment", { state: { carId: carId } });
  }

  useEffect(() => {
    if (paymentId) {
      setPaymentDone(true);
    }
  }, [paymentId]);

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
    }, 3000);

    return () => clearInterval(interval);
  }, [images]);

  useEffect(() => {
    if (!car) return;
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_BASE}/users/${car.userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching user data :", err);
      }
    };
    fetchUser();
  }, [car, API_BASE]);


// fetch recommendations after car is loaded
useEffect(() => {
  if (!carId) return;

  const fetchRecommendations = async () => {
    try {
      setLoadingRecommendations(true);
      const recRes = await axios.get(`${API_BASE}/cars/recommendations/${carId}`);
      setRecommendations(recRes.data || []);
    } catch (err) {
      console.error("Error fetching recommendations:", err);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  fetchRecommendations();
}, [carId, API_BASE]);



  const SkeletonLoader = () => (
    <div className="min-h-screen bg-gray-50 py-12 px-4 animate-pulse">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-lg overflow-hidden p-8">
        <div className="h-10 bg-gray-200 rounded-xl w-1/2 mx-auto mb-10"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="w-full h-96 bg-gray-200 rounded-3xl"></div>
          <div className="flex flex-col gap-6">
            <div className="h-8 bg-gray-200 rounded-lg w-2/3"></div>
            <div className="h-6 bg-gray-200 rounded-lg w-full"></div>
            <div className="h-12 bg-gray-200 rounded-xl"></div>
            <div className="h-32 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    </div>
  );

  if (!car) {
    return <SkeletonLoader />;
  }

  return (
    <div>
      <NavBarBasic />
      <div className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="grid md:grid-cols-2 gap-6">
              {/* LEFT - Car Images */}
              <div className="p-6">
                {images.length > 0 ? (
                  <img
                    src={images[currentIndex].imageURL}
                    alt="Car Preview"
                    className="w-full h-96 object-cover rounded-2xl shadow-md mb-4"
                  />
                ) : (
                  <p className="text-gray-500">No images available</p>
                )}

                {images.length > 1 && (
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {images.map((img, index) => (
                      <img
                        key={index}
                        src={img.imageURL}
                        alt={`Thumbnail ${index + 1}`}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-28 h-20 object-cover rounded-xl shadow cursor-pointer transition hover:scale-110 ${
                          currentIndex === index
                            ? "ring-4 ring-indigo-500"
                            : ""
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* RIGHT - Car Info */}
              <div className="p-8 flex flex-col justify-between border-l border-gray-100">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-3">
                    {car.make} {car.model}
                  </h1>
                  <p className="text-gray-600 mb-6">{features?.yearOfManufacture} • {features?.fuelType} • {features?.transmission}</p>
                  <p className="text-4xl font-extrabold text-indigo-700 mb-6">
                    ₹{car.price}
                  </p>
                  {details && (
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-gray-50 p-3 rounded-lg shadow-sm">Age: {details.age} years</div>
                      <div className="bg-gray-50 p-3 rounded-lg shadow-sm">Driven: {details.distanceTravelled} km</div>
                      <div className="bg-gray-50 p-3 rounded-lg shadow-sm">Owners: {details.numberOfOwners}</div>
                      <div className="bg-gray-50 p-3 rounded-lg shadow-sm">Seats: {features?.seatingCapacity}</div>
                    </div>
                  )}
                </div>

                {!paymentDone && (
                  <button
                    onClick={handlepayment}
                    className="mt-8 w-full bg-gradient-to-r from-indigo-600 to-indigo-800 text-white py-3 rounded-xl shadow-md hover:scale-105 transition"
                  >
                    Make Payment 💳
                  </button>
                )}

                {paymentDone && (
                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="mt-8 w-full bg-gradient-to-r from-green-500 to-green-700 text-white py-3 rounded-xl shadow-md hover:scale-105 transition"
                  >
                    {showDetails ? "Hide Details" : "Contact Seller 📞"}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Features */}
            {features && (
              <div className="bg-white rounded-2xl shadow p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Features</h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-gray-50 p-3 rounded-md">Engine: {features.engine}</div>
                  <div className="bg-gray-50 p-3 rounded-md">Mileage: {features.mileage}</div>
                  <div className="bg-gray-50 p-3 rounded-md">Fuel: {features.fuelType}</div>
                  <div className="bg-gray-50 p-3 rounded-md">Transmission: {features.transmission}</div>
                  <div className="bg-gray-50 p-3 rounded-md">Body: {features.bodyType}</div>
                  <div className="bg-gray-50 p-3 rounded-md">Color: {features.color}</div>
                  <div className="bg-gray-50 p-3 rounded-md">Drive: {features.driveType}</div>
                  <div className="bg-gray-50 p-3 rounded-md">Year: {features.yearOfManufacture}</div>
                </div>
              </div>
            )}

            {/* Location */}
            {locationData && (
              <div className="bg-white rounded-2xl shadow p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Location</h2>
                <div className="flex flex-col gap-3 text-sm">
                  <div className="bg-gray-50 p-3 rounded-md">Country: {locationData.country}</div>
                  <div className="bg-gray-50 p-3 rounded-md">State: {locationData.state}</div>
                  <div className="bg-gray-50 p-3 rounded-md">City: {locationData.city}</div>
                </div>
              </div>
            )}
          </div>

          {/* Seller Section */}
          {showDetails && user && (
            <div className="mt-10 bg-white rounded-2xl shadow p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Seller Information</h2>
              <p className="text-gray-700 mb-2"><span className="font-medium">Name:</span> {user.fullName}</p>
              <p className="text-gray-700 mb-2"><span className="font-medium">Phone:</span> {user.phoneNo}</p>
              <p className="text-gray-700"><span className="font-medium">Email:</span> {user.emailId}</p>
              <p className="text-xs text-gray-400 mt-4 italic">User ID: {car.userId}</p>
            </div>
          )}
        </div>
{/* Recommendations Section */}
<div className="mt-10">
  <h2 className="text-2xl font-bold text-gray-800 mb-4">
    Similar Cars You May Like
  </h2>

  {loadingRecommendations ? (
    <p className="text-gray-500">Loading recommendations...</p>
  ) : recommendations.length === 0 ? (
    <p className="text-gray-500">No similar cars found.</p>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recommendations.map((rec) => (
        <div
          key={rec._id || rec.carId} // make sure key matches backend id
          onClick={() => navigate("/carView", { state: { carId: rec._id || rec.carId } })}
          className="cursor-pointer bg-gray-50 rounded-xl shadow hover:scale-105 transition p-4"
        >
          <img
            src={rec.images?.[0]?.imageURL || "/placeholder.jpg"}
            alt={rec.model}
            className="w-full h-40 object-cover rounded-lg mb-3"
          />
          <h3 className="text-lg font-semibold">{rec.make} {rec.model}</h3>
          <p className="text-gray-600 text-sm">
            ₹{rec.price} • {rec.features?.fuelType} • {rec.features?.transmission}
          </p>
        </div>
      ))}
    </div>
  )}
</div>

      </div>
      <Footer />
    </div>
  );
}

export default CarView;

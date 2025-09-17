import { useEffect, useState } from "react";
import { useLocation,useNavigate } from "react-router-dom";
import axios from "axios";
import NavBarBasic from "./NavBarBasic";
import Footer from "./Footer";
function CarView() {
  const location = useLocation();
  const navigate = useNavigate();
  const users = JSON.parse(localStorage.getItem("user")||"null");  
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

  const [user,setUser] = useState(null);
  const [paymentDone, setPaymentDone] = useState(false);
  const [showDetails,setShowDetails] = useState(false);
  const API_BASE = import.meta.env.VITE_API_BASE;

  const [currentIndex, setCurrentIndex] = useState(0);

  function handlepayment(){
    if(userId==="null" || email==="null" || token==="null"){
      alert("Please login to make payment");
      navigate("/Login");
      return;
    }
    navigate("/Payment", { state: { carId:carId} })
  }

  useEffect(() => {
    if(paymentId){
    setPaymentDone(true);
    }
  },[paymentId])

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
    if(!car){
      return;
    }
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_BASE}/users/${car.userId}`,{
          headers: {
    Authorization: `Bearer ${token}`
  }
        })
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
    <div>
      <NavBarBasic/>
    <div className="min-h-screen bg-[#FAFAFA] py-10 px-4">
      <div className="max-w-6xl mx-auto bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden p-6 md:p-10 border border-purple-100 mt-[10%]">
        {/* Title */}
        <h1 className="text-4xl font-extrabold text-purple-900 mb-10 text-center tracking-wide drop-shadow">
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
                className="w-full h-96 object-cover rounded-3xl shadow-xl mb-6 transition duration-700 ease-in-out"
              />
            ) : (
              <p className="text-gray-500">No images available</p>
            )}

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {images.map((img, index) => (
                  <img
                    key={index}
                    src={img.imageURL}
                    alt={`Thumbnail ${index + 1}`}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-28 h-20 object-cover rounded-xl shadow cursor-pointer transition hover:scale-110 ${
                      currentIndex === index
                        ? "ring-4 ring-purple-500"
                        : ""
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Price & Status */}
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-2xl p-6 mt-6 shadow-inner">
              <p className="text-gray-800 text-lg mb-2">
                <strong>Price:</strong> <span className="text-purple-700 font-bold">₹{car.price}</span>
              </p>
              {/* <p className="text-gray-700">
                <strong>Status:</strong>{" "}
                <span
                  className={`px-4 py-1 rounded-full text-sm font-semibold shadow-sm ${
                    car.status === "Available"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {car.status}
                </span>
              </p> */}
            </div>

            {/* Features */}
            {features && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-purple-800 mb-4 border-b border-purple-200 pb-2">
                  Features
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">Engine: {features.engine}</div>
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">Mileage: {features.mileage}</div>
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">Fuel: {features.fuelType}</div>
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">Transmission: {features.transmission}</div>
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">Seats: {features.seatingCapacity}</div>
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">Body: {features.bodyType}</div>
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">Color: {features.color}</div>
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">Year: {features.yearOfManufacture}</div>
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">Drive: {features.driveType}</div>
                </div>
              </div>
            )}

            {/* Car Details */}
            {details && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-purple-800 mb-4 border-b border-purple-200 pb-2">
                  Car Details
                </h2>
                <div className="flex flex-col gap-3">
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">Age: {details.age} years</div>
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">Distance: {details.distanceTravelled} km</div>
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">Owners: {details.numberOfOwners}</div>
                </div>
              </div>
            )}

            {/* Location */}
            {locationData && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-purple-800 mb-4 border-b border-purple-200 pb-2">
                  Location
                </h2>
                <div className="flex flex-col gap-3">
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">Country: {locationData.country}</div>
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">State: {locationData.state}</div>
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">City: {locationData.city}</div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT SIDE */}
          <div className="p-8 rounded-3xl shadow-xl flex flex-col justify-between border border-purple-100">
            <div>
              <h2 className="text-3xl font-bold text-purple-900 mb-4">
                Seller Information
              </h2>
              <p className="text-gray-600 mb-6">
                Make the payment to unlock full seller contact details and connect directly.
              </p>

              {!paymentDone &&
              <button onClick={() => handlepayment()}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-800 text-white py-3 rounded-xl shadow-lg transition transform hover:scale-105 hover:opacity-90 mb-5 font-semibold">
                Make Payment 💳
              </button>
              }

              {paymentDone &&  ( 
                <button onClick={() => {setShowDetails(!showDetails)}}
                className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white py-3 rounded-xl shadow-lg transition transform hover:scale-105 hover:opacity-90 font-semibold">
                {showDetails ? "Hide Details" : "Contact Seller 📞"}
              </button>
              )}

              {showDetails && user && (
                <div className="mt-8 bg-white rounded-2xl shadow-md p-6 border border-purple-200 animate-fadeIn">
                  <h3 className="text-xl font-semibold text-purple-800 mb-4">
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
            <p className="text-sm text-gray-400 mt-8 text-center italic">
              User ID: {car.userId}
            </p>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </div>
  );
}

export default CarView;

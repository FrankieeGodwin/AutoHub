import { useEffect, useState } from "react";
import axios from "axios";
import NavBarBasic from "./NavBarBasic";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom"; 


function Notification() {
  const users = JSON.parse(localStorage.getItem("user") || "null");
  const userId = users?.userId;
  const token = users?.token;
  const API_BASE = import.meta.env.VITE_API_BASE;

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState({}); 
  const [expandedNotification, setExpandedNotification] = useState(null); 
  const navigate = useNavigate();


  useEffect(() => {
    if (!userId) return;

    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`${API_BASE}/SellerNotification/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const notificationsData = res.data;

        const notificationsWithCar = await Promise.all(
          notificationsData.map(async (info) => {
            try {
              const [carRes, featuresRes, imagesRes] = await Promise.all([
                axios.get(`${API_BASE}/cars/main/${info.carId}`),
                axios.get(`${API_BASE}/cars/features/${info.carId}`),
                axios.get(`${API_BASE}/cars/images/${info.carId}`),
              ]);

              return {
                ...info,
                car: carRes.data,
                features: featuresRes.data,
                images: imagesRes.data,
              };
            } catch (err) {
              console.error("Error fetching car details:", err);
              return info;
            }
          })
        );

        setNotifications(notificationsWithCar);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [userId]);


  useEffect(() => {
    if(userId){
      axios.put(`${API_BASE}/SellerNotification/markAsViewed/${userId}`, 
        {},
        {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        console.log("Notifications marked as viewed");
      })
      .catch((err) => {
        console.error("Error marking notifications as viewed:", err);
      }); 
    }
  },[userId,token,API_BASE ]);
  if (loading) {
    return (
       <div className="bg-[#FAFAFA] min-h-screen flex flex-col justify-between "> 
      <NavBarBasic />
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-purple-700 font-semibold text-lg animate-pulse">
          Loading Notifications...
        </div>
      </div>
      <Footer />
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
       <div className="bg-[#FAFAFA] min-h-screen flex flex-col justify-between "> 
      <NavBarBasic />
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-500 text-lg">No Notifications</p>
      </div>
      <Footer />
      </div>
    );
  }

  return (
  <div className="bg-[#FAFAFA] min-h-screen flex flex-col justify-between"> 
    <NavBarBasic />
    <div className="p-6 bg-gradient-to-br from-gray-50 via-purple-50 to-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Notifications
      </h2>

      <div className="space-y-6">
        {notifications.map((info) => {
          const car = info.car || {};
          const features = info.features || {};
          const images = info.images || [];
          const currentIndex = currentImageIndex[info._id] || 0;
          const isExpanded = expandedNotification === info._id;

          return (
            <div
              key={info._id}
              onClick={() =>
                setExpandedNotification((prev) => (prev === info._id ? null : info._id))
              }
              className={`cursor-pointer bg-white rounded-3xl shadow-md hover:shadow-2xl transition duration-300 ease-in-out overflow-hidden ${
                isExpanded ? "p-4" : "p-3"
              }`}
            >
              {/* Compact view */}
              {!isExpanded && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {images.length > 0 ? (
                      <img
                        src={images[0].imageURL}
                        alt={car.make}
                        className="w-20 h-20 object-cover rounded-xl"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gray-200 flex items-center justify-center text-gray-400 rounded-xl">
                        No Image
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-lg text-gray-800">
                        {car.make || "-"} {car.model || "-"}
                      </h3>
                      <p className="text-purple-700 font-medium">
                        ₹{car.price ? car.price / 100000 : "-"} Lakhs
                      </p>
                      <p className="text-sm text-gray-600">
                        Seller: {info.sellerName || "-"}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm">Click to view details ⬇️</p>
                </div>
              )}

              {/* Expanded View */}
              {isExpanded && (
                <div className="flex flex-col md:flex-row gap-6 mt-3">
                  {/* Left side - Images */}
                  <div className="md:w-1/3 relative">
                    {images.length > 0 ? (
                      <div className="relative">
                        <img
                          src={images[currentIndex].imageURL}
                          alt={`${car.make} ${car.model}`}
                          className="w-full h-64 md:h-full object-cover rounded-2xl"
                        />
                        {images.length > 1 && (
                          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
                            {images.map((_, idx) => (
                              <span
                                key={idx}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCurrentImageIndex((prev) => ({
                                    ...prev,
                                    [info._id]: idx,
                                  }));
                                }}
                                className={`w-3 h-3 rounded-full cursor-pointer transition ${
                                  currentIndex === idx
                                    ? "bg-purple-600 scale-110"
                                    : "bg-gray-300"
                                }`}
                              ></span>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                        <p className="text-gray-400">No Image</p>
                      </div>
                    )}
                  </div>

                  {/* Right side - Car + Seller Info */}
                  <div className="md:w-2/3 flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl font-semibold text-gray-800 mb-1">
                        {car.make || "-"} {car.model || "-"}
                      </h3>
                      <p className="text-purple-700 mb-3 text-lg font-bold">
                        ₹{car.price ? car.price / 100000 : "-"} Lakhs
                      </p>

                      <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 mb-4">
                        <p>Fuel: {features.fuelType || "-"}</p>
                        <p>Transmission: {features.transmission || "-"}</p>
                        <p>Seats: {features.seatingCapacity || "-"}</p>
                        <p>Year: {features.yearOfManufacture || "-"}</p>
                      </div>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl text-sm text-gray-700 shadow-inner">
                      <p>
                        <span className="font-medium">Seller:</span>{" "}
                        {info.sellerName || "-"}
                      </p>
                      <p>
                        <span className="font-medium">Email:</span>{" "}
                        {info.sellerEmail || "-"}
                      </p>
                      <p>
                        <span className="font-medium">Phone:</span>{" "}
                        {info.sellerPhone || "-"}
                      </p>
                    </div>
   <div className="mt-4">
  <button
    onClick={() => navigate(`/chat/${info.sellerId}`)} // dynamically pass sellerId
    className="bg-purple-700 text-white text-center px-4 py-2 rounded-lg hover:bg-purple-800 transition justify-center items-center flex w-full"
  >
    Chat with Seller
  </button>
</div>


                    
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
    <Footer />
  </div>
);
}

export default Notification;
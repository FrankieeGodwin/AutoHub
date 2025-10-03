import { useEffect, useState } from "react";
import axios from "axios";
import NavBarBasic from "./NavBarBasic";
import Footer from "./Footer";


function Notification() {
  const users = JSON.parse(localStorage.getItem("user") || "null");
  const userId = users?.userId;
  const token = users?.token;
  const API_BASE = import.meta.env.VITE_API_BASE;

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState({}); 

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
    <div className="bg-[#FAFAFA] min-h-screen flex flex-col justify-between "> 
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

          return (
            <div
              key={info._id}
              className="flex flex-col md:flex-row bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition duration-300 ease-in-out"
            >
              {/* Left side - Car Image */}
              <div className="md:w-1/3 relative">
                {images.length > 0 ? (
                  <div className="relative h-full">
                    <img
                      src={images[currentIndex].imageURL}
                      alt={`${car.make} ${car.model}`}
                      className="w-full h-64 md:h-full object-cover"
                    />
                    {images.length > 1 && (
                      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        {images.map((_, idx) => (
                          <span
                            key={idx}
                            onClick={() =>
                              setCurrentImageIndex((prev) => ({
                                ...prev,
                                [info._id]: idx,
                              }))
                            }
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
              <div className="md:w-2/3 p-6 flex flex-col justify-between">
              

                {/* Car Info */}
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

                {/* Seller Info */}
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
              </div>
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

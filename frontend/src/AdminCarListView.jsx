import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavBarAdmin from "./NavBarAdmin.jsx";
import Footer from "./Footer";

function AdminCarListView() {
  const [userCars, setuserCars] = useState([]);
  const [dealerCars, setDealerCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const API_BASE = import.meta.env.VITE_API_BASE;
  const navigate = useNavigate();
  const [sellers, setSellers] = useState({});

  

  useEffect(() => {
    const fetchAllCars = async () => {
      try {
        setLoading(true);
        const userCarsRes = await axios.get(`${API_BASE}/cars/`);
        const userCars = userCarsRes.data || [];
        const dealerCarsRes = await axios.get(`${API_BASE}/api/newcars/all-cars`);
        const dealerCars = dealerCarsRes.data.car || [];

        setuserCars(userCars);
        setDealerCars(dealerCars);
      } catch (err) {
        console.error("Error fetching all cars:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllCars();
  }, [API_BASE]);

    const fetchUser = async (userId) => {
        try {
            const token = localStorage.getItem("adminToken");
            console.log("Admin Token:", localStorage.getItem("adminToken"));
            if (!token) {
                return;
            }
            const res = await axios.get(`${API_BASE}/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}`},
            });

            setSellers((prev) => ({
  ...prev,
  [userId]: res.data, // store seller by userId
}));

        }
        catch (err) {
            console.error("Error fetching user data:", err);
            navigate("/AdminLogin");
        }
    }


  const SkeletonLoader = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="w-full h-80 bg-gray-200 rounded-3xl animate-pulse"
        ></div>
      ))}
    </div>
  );

  
  return (
  <div>
    <NavBarAdmin />

    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 py-16 px-6 mt-20">
      <div className="max-w-7xl mx-auto space-y-20">

        {/* Dealer Cars Section */}
        <section>
          <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-10">
            Admin — All Dealer New Cars
          </h1>

          {dealerCars.length === 0 ? (
            <p className="text-gray-500 text-center text-lg">
              No dealer cars available.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {dealerCars.map((car) => (
                <div
                  key={car._id}
                  onClick={() => navigate(`/car/${car._id}`)}
                  className="bg-white rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transform transition-all duration-300 cursor-pointer overflow-hidden group border border-gray-100"
                >
                  <div className="relative">
                    <img
                      src={car.media?.images?.[0] || "/placeholder.jpg"}
                      alt={car.modelName}
                      className="w-full h-56 object-cover rounded-t-3xl group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                      New
                    </span>
                  </div>

                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      {car.brand} {car.modelName}
                    </h3>
                    <p className="text-gray-600 text-lg mb-2 font-medium">
                      ₹{car.priceRange?.min?.toLocaleString()} - ₹{car.priceRange?.max?.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500 mb-1">
                      Fuel: {car.fuelTypes?.join(", ") || "Unknown"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Variant: {car.variant || "N/A"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* User Used Cars Section */}
        <section>
          <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-10">
            Admin — All User Used Cars (2nd Hand)
          </h1>

          {loading ? (
            <SkeletonLoader />
          ) : userCars.length === 0 ? (
            <p className="text-gray-500 text-center text-lg">
              No user cars found.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {userCars.map((car) => (
                <div
                  key={car._id}
                  onClick={() => navigate("/carView", { state: { carId: car._id } })}
                  className="bg-white rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transform transition-all duration-300 cursor-pointer overflow-hidden group border border-gray-100"
                >
                  <div className="relative">
                    <img
                      src={car.images?.[0]?.imageURL || "/placeholder.jpg"}
                      alt={car.model}
                      className="w-full h-56 object-cover rounded-t-3xl group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-3 right-3 bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                      Used
                    </span>
                  </div>

                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      {car.make} {car.model}
                    </h3>
                    <p className="text-gray-600 text-lg mb-2 font-medium">
                      ₹{(car.price / 100000).toFixed(2)} Lakhs
                    </p>
                    <p className="text-sm text-gray-500 mb-1">
                      {car.features?.fuelType || "Unknown"} •{" "}
                      {car.features?.transmission || "Unknown"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Seller ID: <span className="font-semibold text-gray-700">{car.userId}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>

    <Footer />
  </div>
);

}

export default AdminCarListView;
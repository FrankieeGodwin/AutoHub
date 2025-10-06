import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavBarAdmin from "./NavBarAdmin.jsx";
import Footer from "./Footer";

function AdminCarListView() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const API_BASE = import.meta.env.VITE_API_BASE;
  const navigate = useNavigate();
  const [sellers, setSellers] = useState({});

  useEffect(() => {
    const fetchAllCars = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE}/cars/`);
        setCars(res.data || []);
    
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
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 py-12 px-4 mt-20">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
            🚘 Admin — All Listed Cars
          </h1>

          {loading ? (
            <SkeletonLoader />
          ) : cars.length === 0 ? (
            <p className="text-gray-500 text-center text-lg">
              No cars found. Please check back later.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {cars.map((car) => (
                <div
                  key={car._id}
                  onClick={() =>
                    navigate("/carView", { state: { carId: car._id } })
                  }
                  className="bg-white rounded-3xl shadow-md hover:shadow-2xl hover:-translate-y-2 transform transition-all duration-300 cursor-pointer overflow-hidden group"
                >
                  {/* Car Image */}
                  <div className="relative">
                    <img
                      src={car.images?.[0]?.imageURL || "/placeholder.jpg"}
                      alt={car.model}
                      className="w-full h-56 object-cover rounded-t-3xl group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Car Details */}
                  <div className="p-5">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-1">
                      {car.make} {car.model}
                    </h3>
                    <p className="text-gray-600 text-lg mb-2">
                      ₹{(car.price / 100000).toFixed(2)} Lakhs
                    </p>
                    <p className="text-sm text-gray-500 mb-3">
                      {car.features?.fuelType || "Unknown"} •{" "}
                      {car.features?.transmission || "Unknown"}
                    </p>

                    
                    <p className="text-sm text-gray-800 mb-3">{car.userId}</p>
                  </div>
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

export default AdminCarListView;

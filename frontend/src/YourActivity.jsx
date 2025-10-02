import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavBarBasic from "./NavBarBasic";
import Footer from "./Footer";

export default function YourActivity() {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.userId;
  const API_BASE = import.meta.env.VITE_API_BASE;
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchUserActivity = async () => {
      try {
        const allActivitiesRes = await axios.get(
          `${API_BASE}/activity/getByUser/${userId}`
        );
        const allActivities = allActivitiesRes.data;

        allActivities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        const uniqueActivities = [];
        const seenCars = new Set();
        for (const activity of allActivities) {
          if (!seenCars.has(activity.carId)) {
            uniqueActivities.push(activity);
            seenCars.add(activity.carId);
          }
        }

        setActivities(uniqueActivities);

        const carsData = [];
        for (const activity of uniqueActivities) {
          const carId = activity.carId;
          const carRes = await axios.get(`${API_BASE}/cars/main/${carId}`);
          const car = carRes.data;
          const imagesRes = await axios.get(`${API_BASE}/cars/images/${carId}`);
          const images = imagesRes.data;

          carsData.push({
            activityId: activity._id,
            role: activity.role,
            createdAt: activity.createdAt,
            car: car,
            images: images,
          });
        }
        setCars(carsData);
      } catch (err) {
        console.error("Error fetching user activity or cars:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserActivity();
  }, [userId]);

  const handleClickCar = (carId, model) => {
    axios.post(`${API_BASE}/activity/`, {
      userId: userId,
      carId: carId,
      role: "User",
    });
    navigate("/carView", { state: { carId: carId, model: model } });
  };

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-500 text-lg">
        Loading activities...
      </p>
    );

  return (
    <div className="bg-gray-50 min-h-screen">
      <NavBarBasic />
      <div className="max-w-4xl mx-auto p-6 mt-20">
        <h2 className="text-3xl font-bold text-center mb-10">Your Activity</h2>
        {cars.length === 0 ? (
          <p className="text-center text-gray-500">No activities found.</p>
        ) : (
          <ul className="space-y-6">
            {cars.map((record) => (
              <li
                key={record.activityId}
                className="flex flex-col md:flex-row items-start gap-6 bg-white p-6 rounded-2xl shadow hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex-shrink-0 w-full md:w-48">
                  {record.images[0] ? (
                    <img
                      src={record.images[0].imageURL}
                      alt={record.car.model}
                      className="w-full h-40 object-cover rounded-2xl"
                    />
                  ) : (
                    <div className="w-full h-40 bg-gray-200 rounded-2xl flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <p>
                    <span className="font-semibold">Role:</span> {record.role}
                  </p>
                  <p>
                    <span className="font-semibold">Activity Date:</span>{" "}
                    {new Date(record.createdAt).toLocaleString()}
                  </p>
                  <p>
                    <span className="font-semibold">Car:</span> {record.car.make}{" "}
                    {record.car.model} - ₹
                    {(record.car.price / 100000).toLocaleString()} Lakhs
                  </p>
                  <p>
                    <span className="font-semibold">Registration No:</span>{" "}
                    {record.car.regno}
                  </p>
                  <button
                    onClick={() =>
                      handleClickCar(record.car._id, record.car.model)
                    }
                    className="mt-4 bg-purple-800 hover:bg-purple-900 text-white py-2 px-4 rounded-xl transition-colors duration-200"
                  >
                    View Car Details
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Footer />
    </div>
  );
}

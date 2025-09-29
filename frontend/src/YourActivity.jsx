import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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

    // Sort activities by createdAt descending
    allActivities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Keep only the latest activity per carId
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
    axios.post(`${API_BASE}/activity/`,{
      userId:userId,
      carId:carId,
      role:"User"
    })
    navigate("/carView", { state: { carId: carId, model: model } });
  };


  if (loading) return <p>Loading activities...</p>;

  return (
    <div style={{ padding: "1rem", maxWidth: "800px", margin: "0 auto" }}>
      <h2 className="text-2xl font-bold text-center mb-5">Your Activities</h2>
      {cars.length === 0 && <p>No activities found.</p>}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {cars.map((record) => (
          <li
            key={record.activityId}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "1rem",
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "1rem",
              marginBottom: "1rem",
              boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
            }}
          >
            <div style={{ flex: "0 0 200px" }}>
              {record.images[0] ? (
                <img
                  src={record.images[0].imageURL}
                  alt={record.car.model}
                  style={{
                    width: "100%",
                    height: "auto",
                    borderRadius: "8px",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "120px",
                    backgroundColor: "#f0f0f0",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#999",
                  }}
                >
                  No Image
                </div>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <p>
                <strong>Role:</strong> {record.role}
              </p>
              <p>
                <strong>Activity Date:</strong>{" "}
                {new Date(record.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Car:</strong> {record.car.make} {record.car.model} - ₹
                {(record.car.price/100000).toLocaleString()} Lakhs
              </p>
              <p>
                <strong>Registration No:</strong> {record.car.regno}
              </p>
               <button onClick={() => handleClickCar(record.car._id, record.car.model)} className="bg-purple-800 hover:bg-purple-900 p-2 mt-5 rounded-xl w-[50%] text-white">View Car Details</button>

            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

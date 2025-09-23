import { useState, useEffect } from "react";
import axios from "axios";
import NavBarBasic from "./NavBarBasic";
import Footer from "./Footer";
import EditProfile from "./EditProfile";
import YourCars from "./YourCars";
import Favorites from "./Favorites";

export default function Profile() {
  const users = JSON.parse(localStorage.getItem("user"));
  const userId = users?.userId;
  const token = users?.token;
  const API_BASE = import.meta.env.VITE_API_BASE;

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(null); // For dynamic right content

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_BASE}/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching user data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, API_BASE]);

  if (loading)
    return <p className="text-center mt-10 text-lg">Loading profile...</p>;
  if (!user)
    return <p className="text-center mt-10 text-red-500">User not found.</p>;

  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      <NavBarBasic />
      <div className="flex flex-col md:flex-row px-4 md:px-10 py-10 gap-6">
        {/* Left Panel - Profile */}
        <div className="md:w-1/3 bg-white shadow-2xl rounded-2xl p-6 sticky top-20 h-fit">
          <h1 className="text-3xl font-bold text-purple-800 text-center mb-6">
            Profile
          </h1>
          <div className="space-y-4">
            <p className="bg-purple-50 p-3 rounded-lg shadow-sm">
              <strong>Full Name:</strong> {user.fullName}
            </p>
            <p className="bg-purple-50 p-3 rounded-lg shadow-sm">
              <strong>Email:</strong> {user.emailId}
            </p>
            <p className="bg-purple-50 p-3 rounded-lg shadow-sm">
              <strong>Phone:</strong> {user.phoneNo}
            </p>
          </div>

          <div className="mt-6 space-y-3">
            <button
              onClick={() => setActiveTab("edit")}
              className="w-full px-6 py-2 bg-purple-700 text-white rounded-lg shadow hover:bg-purple-800 transition"
            >
              Edit Profile
            </button>
            <button
              onClick={() => setActiveTab("cars")}
              className="w-full px-6 py-2 bg-purple-700 text-white rounded-lg shadow hover:bg-purple-800 transition"
            >
              Your Cars
            </button>
            <button
              onClick={() => setActiveTab("favorites")}
              className="w-full px-6 py-2 bg-purple-700 text-white rounded-lg shadow hover:bg-purple-800 transition"
            >
              Favorites
            </button>
            <button
              onClick={() => setActiveTab("activity")}
              className="w-full px-6 py-2 bg-purple-700 text-white rounded-lg shadow hover:bg-purple-800 transition"
            >
              Your Activity
            </button>
          </div>
        </div>

        {/* Right Panel - Dynamic Content */}
        <div className="md:w-2/3 bg-white shadow-2xl rounded-2xl p-6 min-h-[60vh]">
          {activeTab === "edit" && <EditProfile user={user} />}
          {activeTab === "cars" && <YourCars />}
          {activeTab === "favorites" && <Favorites />}
          {activeTab === "activity" && (
            <div className="text-gray-500 text-lg text-center mt-20">
              Your recent activity will appear here...
            </div>
          )}
          {!activeTab && (
            <div className="text-gray-400 text-center mt-20 text-lg">
              Select an option from the left to view details
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

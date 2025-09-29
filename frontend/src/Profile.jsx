import { useState, useEffect } from "react";
import axios from "axios";
import NavBarBasic from "./NavBarBasic";
import Footer from "./Footer";
import EditProfile from "./EditProfile";
import YourCars from "./YourCars";
import Favorites from "./Favorites";
import { Cog6ToothIcon , ChevronRightIcon , StarIcon , TruckIcon , ClockIcon , EnvelopeIcon , PhoneIcon , UserIcon } from '@heroicons/react/24/outline'; 
import YourActivity from "./YourActivity";
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
      <div className="flex flex-col mt-[5%] md:flex-row px-4 md:px-10 py-10 gap-6">
        {/* Left Panel - Profile */}
        <div className="md:w-1/3 bg-white shadow-2xl rounded-2xl p-6 sticky top-20 h-fit">
          <h1 className="text-3xl font-bold  text-center mb-6">
            Profile
          </h1>
          <div className="space-y-4">
            <p className="flex space-x-6 bg-purple-50 p-3 rounded-lg shadow-sm">
              <UserIcon className="h-6 w-6 text-gray-700"/> <span>{user.fullName}</span>
            </p>
            <p className="flex space-x-6 bg-purple-50 p-3 rounded-lg shadow-sm">
              <EnvelopeIcon className="h-6 w-6 text-gray-700" /> <span>{user.emailId}</span>
            </p>
            <p className="flex space-x-6 bg-purple-50 p-3 rounded-lg shadow-sm">
              <PhoneIcon className="h-6 w-6 text-gray-700"/> <span>{user.phoneNo}</span>
            </p>
          </div>

          <div className="mt-6 space-y-3">
            <button
              onClick={() => setActiveTab("edit")}
              className="flex justify-between w-full px-6 py-2 bg-gray-200 hover:bg-gray-300 transition"
            >
              <div className="flex space-x-6">
              <Cog6ToothIcon className="h-6 w-6 text-gray-700" />
              <span>Edit Profile</span>
              </div>
              <ChevronRightIcon className="h-5 w-5 text-gray-500" />
            </button>

            <button
              onClick={() => setActiveTab("cars")}
              className="flex justify-between w-full px-6 py-2 bg-gray-200 hover:bg-gray-300 transition"
            >
              <div className="flex space-x-6">
              <TruckIcon className="h-6 w-6 text-gray-700" />
              <span>Your Cars</span>
              </div>
              <ChevronRightIcon className="h-5 w-5 text-gray-500" />
            </button>
            <button
              onClick={() => setActiveTab("favorites")}
              className="flex justify-between w-full px-6 py-2 bg-gray-200 hover:bg-gray-300 transition"
            >
              <div className="flex space-x-6">
              <StarIcon className="h-6 w-6 text-gray-700" />
              <span>Favorites</span>
              </div>
              <ChevronRightIcon className="h-5 w-5 text-gray-500" />
            </button>
            <button
              onClick={() => setActiveTab("activity")}
              className="flex justify-between w-full px-6 py-2 bg-gray-200 hover:bg-gray-300 transition"
            >
              <div className="flex space-x-6">
              <ClockIcon className="h-6 w-6 text-gray-700" />
              <span>Your Activity</span>
              </div>
              <ChevronRightIcon className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Right Panel - Dynamic Content */}
        <div className="md:w-2/3 bg-white shadow-2xl rounded-2xl p-6 min-h-[60vh]">
          {activeTab === "edit" && <EditProfile user={user} />}
          {activeTab === "cars" && <YourCars />}
          {activeTab === "favorites" && <Favorites />}
          {activeTab === "activity" && (
            <YourActivity />
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

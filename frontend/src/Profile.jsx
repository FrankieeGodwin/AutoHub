import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

export default function Profile() {
  const location = useLocation();// if URL has /Profile/:id
  const userId = location.state?.userId;
  const emailId = location.state?.emailId; // take from state or params

  const API_BASE = import.meta.env.VITE_API_BASE;

//   import { useLocation } from "react-router-dom";

// export default function Profile() {
  

// const location = useLocation();
//   const userId = location.state?.id;
//   const emailId = location.state?.email; 
//   return (
//     <div>
//       <h1>Profile Page</h1>
//       <p>User ID: {userId}</p>
//     </div>
//   );
// }
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_BASE}/users/${userId}`);
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching user data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, API_BASE]);

  if (loading) {
    return <p className="text-center mt-10 text-lg">Loading profile...</p>;
  }

  if (!user) {
    return <p className="text-center mt-10 text-red-500">User not found.</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-white to-purple-50 py-10 px-4">
      <div className="max-w-md mx-auto bg-white shadow-2xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-purple-800 text-center mb-6">
          {user.fullName}'s Profile
        </h1>

        <div className="space-y-4">
          <p className="bg-purple-50 p-3 rounded-lg shadow-sm">
            <strong>Email:</strong> {user.emailId}
          </p>
          <p className="bg-purple-50 p-3 rounded-lg shadow-sm">
            <strong>Phone:</strong> {user.phoneNo}
          </p>
        </div>

        <div className="mt-6 text-center">
          <button className="px-6 py-2 bg-purple-700 text-white rounded-lg shadow hover:bg-purple-800 transition">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}




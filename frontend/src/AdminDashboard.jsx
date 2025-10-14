import React, { useState, useEffect } from "react";
import NavBarAdmin from "./NavBarAdmin.jsx";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from "chart.js";
import { useNavigate } from "react-router-dom";
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

function AdminDashBoard() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [totalCars, setTotalCars] = useState(0);
  const [NewCars, setNewCars] = useState(0);
  const [activeUserPercentage, setActiveUserPercentage] = useState(0);
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

    useEffect(() => {
  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      const res = await axios.get(`${API_BASE}/admin/dashboard-data`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { totalUsers, activeUsers, totalCars, NewCars } = res.data;
      setTotalUsers(totalUsers);
      setActiveUsers(activeUsers);
      setTotalCars(totalCars);
      setNewCars(NewCars);
      setActiveUserPercentage(((activeUsers / totalUsers) * 100).toFixed(2));
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      alert("Failed to load dashboard stats");
    }
  };

  fetchDashboardData();
}, []);

  // Bar chart for Total vs Active Users
  const usersBarData = {
    labels: ["Total Users", "Active Users"],
    datasets: [
      {
        label: "Users",
        data: [totalUsers, activeUsers],
        backgroundColor: ["#7C3AED", "#10B981"],
      },
    ],
  };

  // Pie chart for active vs inactive users
  const usersPieData = {
    labels: ["Active Users", "Inactive Users"],
    datasets: [
      {
        label: "User Activity",
        data: [activeUsers, totalUsers - activeUsers],
        backgroundColor: ["#10B981", "#F87171"],
      },
    ],
  };

  const carsBarData = {
  labels: ["Used Cars", "New Cars", "Total Cars"],
  datasets: [
    {
      label: "Cars Count",
      data: [totalCars - NewCars, NewCars, totalCars],
      backgroundColor: ["#3B82F6", "#FACC15", "#8B5CF6"], // Blue, Yellow, Purple
      borderRadius: 8,
    },
  ],
};




  // ✅ New Bar chart for Total Cars vs New Cars
// ✅ Pie chart for Total Cars vs New Cars
// const carsPieData = {
//   labels: ["New Cars", "Existing Cars"],
//   datasets: [
//     {
//       label: "Car Distribution",
//       data: [NewCars, totalCars],
//       backgroundColor: ["#FACC15", "#3B82F6"],
//     },
//   ],
// };

  return (
    <>
      <NavBarAdmin />
      <div className="container mx-auto mt-10 px-4">
        <h2 className="text-center text-3xl text-purple-800 font-bold mb-8">
          Admin Dashboard
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-purple-50 p-6 rounded-xl shadow-md text-center hover:shadow-lg transition">
            <h3 className="text-lg font-medium text-gray-700">Total Users</h3>
            <p className="text-4xl font-bold text-purple-800 mt-4">{totalUsers}</p>
          </div>
          <div className="bg-green-50 p-6 rounded-xl shadow-md text-center hover:shadow-lg transition">
            <h3 className="text-lg font-medium text-gray-700">Active Users</h3>
            <p className="text-4xl font-bold text-green-700 mt-4">{activeUsers}</p>
          </div>
          <div className="bg-blue-50 p-6 rounded-xl shadow-md text-center hover:shadow-lg transition">
            <h3 className="text-lg font-medium text-gray-700">Total Cars</h3>
            <p className="text-4xl font-bold text-blue-700 mt-4">{totalCars+NewCars}</p>
            <button
              onClick={() => navigate("/AdminCarListView")}
               className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
            >
              View Cars
            </button>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
  <div className="bg-white p-6 rounded-xl shadow-md">
    <h3 className="text-xl font-semibold mb-4 text-gray-700">Active vs Inactive Users</h3>
    <div className="w-64 h-64 mx-auto">
      <Pie 
        data={usersPieData} 
        options={{ 
          responsive: true, 
          maintainAspectRatio: false 
        }} 
      />
    </div>
    <p className="text-center mt-4 text-gray-600">
      {activeUserPercentage}% users active
    </p>
  </div>
</div>
{/* ✅ Pie chart for Cars */}
{/* <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center justify-center hover:shadow-lg transition">
  <h3 className="text-lg font-medium text-gray-700 mb-4">Cars Overview</h3>
  <div className="w-48 h-48">
    <Pie
      data={carsPieData}
      options={{
        responsive: true,
        maintainAspectRatio: false,
      }}
    />
  </div>
</div> */}

      {/* ✅ Bar Chart for Cars */}
<div className="bg-white p-6 rounded-xl shadow-md">
  <h3 className="text-xl font-semibold mb-4 text-gray-700">
    Total Cars vs New Cars
  </h3>
  <div className="w-full h-64">
    <Bar
  data={carsBarData}
  options={{
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Hide legend for single dataset
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  }}
/>


  </div>
</div>
  


      </div>
    </>
  );
}

export default AdminDashBoard;

import React, { useState, useEffect } from "react";
import NavBarAdmin from "./NavBarAdmin.jsx";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useNavigate } from "react-router-dom";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

function AdminDashBoard() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [totalCars, setTotalCars] = useState(0);
  const [NewCars, setNewCars] = useState(0);
  const [activeUserPercentage, setActiveUserPercentage] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [dealerCount, setDealerCount] = useState(0);
  const [payments, setPayments] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

  useEffect(() => {
    fetchDashboardData();
    fetchAllPayments();
    fetchMonthlySummary();
  }, []);

  const fetchAllPayments = async () => {
    try {
      const res = await axios.get(`${API_BASE}/payment/Admin`);
      setPayments(res.data);
    } catch (err) {
      console.error("Error fetching payments:", err);
      alert("Failed to load payments");
    }
  };

  const fetchMonthlySummary = async () => {
    try {
      const res = await axios.get(`${API_BASE}/payment/Admin/monthly`);
      const formatted = res.data.map((item) => ({
        month: `${new Date(item._id.year, item._id.month - 1).toLocaleString("default", {
          month: "short",
        })} ${item._id.year}`,
        total: item.totalEarnings,
        count: item.count,
      }));
      setMonthlyData(formatted);
    } catch (err) {
      console.error("Error fetching monthly summary:", err);
      alert("Failed to load monthly summary");
    }
  };

    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const res = await axios.get(`${API_BASE}/admin/dashboard-data`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { totalUsers, activeUsers, totalCars, NewCars, userCount, dealerCount } = res.data;
        setTotalUsers(totalUsers);
        setActiveUsers(activeUsers);
        setTotalCars(totalCars);
        setNewCars(NewCars);
        setUserCount(userCount);
        setDealerCount(dealerCount);
        setActiveUserPercentage(((activeUsers / totalUsers) * 100).toFixed(2));
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        alert("Failed to load dashboard stats");
      }
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

  const rolesPieData = {
    labels: ["Users", "Dealers"],
    datasets: [
      {
        label: "Roles Distribution",
        data: [userCount, dealerCount],
        backgroundColor: ["#60A5FA", "#F472B6"], // Blue, Pink
      },
    ],
  };

    const paymentsMonthlyData = {
    labels: monthlyData.map((item) => item.month),
    datasets: [
      {
        label: "Monthly Earnings",
        data: monthlyData.map((item) => item.total),
        backgroundColor: "#FBBF24",
        borderRadius: 8,
      },
    ],
  };

  // Total earnings
  const totalEarnings = payments.reduce((acc, item) => acc + item.amount, 0);


  return (
    <>
      <NavBarAdmin />
      <div className="container mx-auto mt-10 px-4">
        <h2 className="text-center text-4xl text-purple-800 font-extrabold mb-10 tracking-wide">
          Admin Dashboard
        </h2>

        {/* === Top Summary Cards === */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-br from-purple-100 to-purple-50 p-6 rounded-2xl shadow-md text-center hover:shadow-xl transition-all transform hover:scale-105">
            <h3 className="text-lg font-medium text-gray-700">Total Users</h3>
            <p className="text-5xl font-bold text-purple-700 mt-3">{totalUsers}</p>
          </div>

          <div className="bg-gradient-to-br from-green-100 to-green-50 p-6 rounded-2xl shadow-md text-center hover:shadow-xl transition-all transform hover:scale-105">
            <h3 className="text-lg font-medium text-gray-700">Active Users</h3>
            <p className="text-5xl font-bold text-green-700 mt-3">{activeUsers}</p>
            <p className="text-sm text-gray-600 mt-2">
              {activeUserPercentage}% of users are active
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-100 to-blue-50 p-6 rounded-2xl shadow-md text-center hover:shadow-xl transition-all transform hover:scale-105">
            <h3 className="text-lg font-medium text-gray-700">Total Cars</h3>
            <p className="text-5xl font-bold text-blue-700 mt-3">{totalCars + NewCars}</p>
            <button
              onClick={() => navigate("/AdminCarListView")}
              className="mt-5 px-5 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition-all"
            >
              View Cars
            </button>
          </div>
          <div className="bg-gradient-to-br from-yellow-100 to-yellow-50 p-6 rounded-2xl shadow-md text-center hover:shadow-xl transition-all transform hover:scale-105">
            <h3 className="text-lg font-medium text-gray-700">Total Earnings</h3>
            <p className="text-5xl font-bold text-yellow-700 mt-3">₹{totalEarnings}</p>
          </div>
        </div>

        {/* === Charts Section === */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Active vs Inactive Users */}
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all">
            <h3 className="text-xl font-semibold mb-4 text-gray-700 text-center">
              Active vs Inactive Users
            </h3>
            <div className="flex justify-center items-center h-64">
              <Pie
                data={usersPieData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            </div>
            <p className="text-center mt-4 text-gray-600 font-medium">
              {activeUserPercentage}% users active
            </p>
          </div>

          {/* Roles Distribution */}
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all">
            <h3 className="text-xl font-semibold mb-4 text-gray-700 text-center">
              Roles Distribution (User vs Dealer)
            </h3>
            <div className="flex justify-center items-center h-64">
              <Pie
                data={rolesPieData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            </div>
            <p className="text-center mt-4 text-gray-600 font-medium">
              {userCount} Users | {dealerCount} Dealers
            </p>
          </div>

          {/* Cars Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all">
            <h3 className="text-xl font-semibold mb-4 text-gray-700 text-center">
              Total Cars vs New Cars
            </h3>
            <div className="w-full h-64">
              <Bar
                data={carsBarData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      enabled: true,
                      callbacks: {
                        label: (context) =>
                          `${context.dataset.label}: ${context.parsed.y}`,
                      },
                    },
                  },
                  scales: {
                    y: { beginAtZero: true, ticks: { stepSize: 1 } },
                    x: { grid: { display: false } },
                  },
                }}
              />
            </div>
          </div>

        {/* === Payments Monthly Chart === */}
<div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all mb-12">
  <h3 className="text-xl font-semibold mb-4 text-gray-700 text-center">
    Monthly Earnings
  </h3>
  <div className="w-full h-64">
    <Bar
      data={paymentsMonthlyData}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            enabled: true,
            callbacks: {
              label: (context) => `₹${context.parsed.y}`,
            },
          },
        },
        scales: {
          y: { beginAtZero: true },
          x: { grid: { display: false } },
        },
      }}
    />
  </div>
</div>

        </div>

        {/* === Footer Summary (Optional Small Touch) === */}
        <p className="text-center text-gray-500 text-sm mt-10 mb-6">
          © {new Date().getFullYear()} AutoHub Admin Panel | Powered by AutoHub
        </p>
      </div>
    </>
  );
}

export default AdminDashBoard;

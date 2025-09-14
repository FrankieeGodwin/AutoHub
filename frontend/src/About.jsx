import React from "react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-20 px-6 relative">
      {/* Back to Home Button - Top Left */}
      <div className="absolute top-6 left-6">
        <Link to="/">
          <button className="px-5 py-2 bg-purple-700 text-white rounded-lg shadow-md hover:bg-purple-800 transition">
            ⬅ Home
          </button>
        </Link>
      </div>

      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-10 mt-12">
        <h1 className="text-3xl font-bold text-purple-700 mb-6">About AutoHub</h1>
        <p className="text-gray-700 leading-relaxed mb-4">
          AutoHub is your trusted destination for exploring, comparing, and buying cars. Inspired by industry leaders like CarDekho, we combine technology with automotive passion to bring you the most transparent car-buying experience.
        </p>

        <h2 className="text-xl font-semibold text-purple-600 mt-6 mb-3">🚗 Our Mission</h2>
        <p className="text-gray-700 mb-4">
          To simplify car buying and selling with data-driven insights, verified dealers, and seamless browsing.
        </p>

        <h2 className="text-xl font-semibold text-purple-600 mt-6 mb-3">💡 Why Choose Us?</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>Comprehensive car reviews & specifications.</li>
          <li>Advanced filters for personalized search.</li>
          <li>Trusted dealer network for safe transactions.</li>
        </ul>
      </div>
    </div>
  );
}

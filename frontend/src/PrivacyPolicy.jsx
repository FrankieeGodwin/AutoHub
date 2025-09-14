import React from "react";
import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
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
        <h1 className="text-3xl font-bold text-purple-700 mb-6">Privacy Policy</h1>
        <p className="text-gray-700 leading-relaxed mb-4">
          At AutoHub, your privacy is our top priority. This Privacy Policy explains how we collect, use, and protect your personal information when you browse our platform, search cars, or use our services.
        </p>

        <h2 className="text-xl font-semibold text-purple-600 mt-6 mb-3">1. Information We Collect</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>Personal details such as name, email, and contact number.</li>
          <li>Search history, preferences, and interactions on AutoHub.</li>
          <li>Device and browser information for better user experience.</li>
        </ul>

        <h2 className="text-xl font-semibold text-purple-600 mt-6 mb-3">2. How We Use Your Data</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          We use your data to recommend cars, improve our platform, and connect you with verified dealers. We never sell your information to third parties.
        </p>

        <h2 className="text-xl font-semibold text-purple-600 mt-6 mb-3">3. Security</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          We implement advanced encryption and authentication measures to safeguard your data against unauthorized access.
        </p>
      </div>
    </div>
  );
}

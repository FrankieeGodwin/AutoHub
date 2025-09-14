import React from "react";
import { Link } from "react-router-dom";

export default function TermsConditions() {
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
        <h1 className="text-3xl font-bold text-purple-700 mb-6">Terms & Conditions</h1>
        <p className="text-gray-700 mb-4">
          By accessing AutoHub, you agree to the following Terms & Conditions. Please read them carefully before using our services.
        </p>

        <h2 className="text-xl font-semibold text-purple-600 mt-6 mb-3">1. Use of Platform</h2>
        <p className="text-gray-700 mb-4">
          You may browse, search, and compare cars for personal use. Commercial misuse or data scraping is strictly prohibited.
        </p>

        <h2 className="text-xl font-semibold text-purple-600 mt-6 mb-3">2. Dealer Listings</h2>
        <p className="text-gray-700 mb-4">
          AutoHub provides listings from verified dealers. However, we are not responsible for individual transactions between buyers and sellers.
        </p>

        <h2 className="text-xl font-semibold text-purple-600 mt-6 mb-3">3. Limitation of Liability</h2>
        <p className="text-gray-700 mb-4">
          AutoHub strives for accuracy but does not guarantee 100% correctness of all car details, specifications, or pricing.
        </p>
      </div>
    </div>
  );
}

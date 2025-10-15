import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import NavBarBasic from "./NavBarBasic";
import Footer from "./FooterForDealer";
const CarViewPage = () => {
  const { newcarid } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const API_BASE = import.meta.env.VITE_API_BASE;
useEffect(() => {
  const fetchCarDetails = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/newcars/car/${newcarid}`);
      setCar(res.data.car); // ✅ FIXED
    } catch (err) {
      console.error("Error fetching car details:", err);
      setError("Failed to load car details");
    } finally {
      setLoading(false);
    }
  };
  fetchCarDetails();
}, [newcarid]);

  if (loading) return <p className="text-center mt-10 text-gray-600">Loading car details...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!car) return <p className="text-center mt-10 text-gray-600">Car not found</p>;

  return (
    <div>
    <NavBarBasic/>
    <div className="min-h-screen bg-[#FAFAFA] p-6 mt-20">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-purple-800 mb-6">
          {car.brand} {car.modelName} ({car.variant})
        </h1>
        <CarDetails car={car} />
      </div>
    </div>
    <Footer/>
    </div>
  );
};

// ✅ Car Details Component (reused from DealerDashboard)
const CarDetails = ({ car }) => {
  const [activeTab, setActiveTab] = useState("carDetails");
  const [selectedImage, setSelectedImage] = useState(car.media?.images?.[0] || "");

  const parseList = (val) => (val?.[0]?.includes("|") ? val[0].split("|") : val || []);

  const fuelTypes = parseList(car.fuelTypes);
  const transmissions = parseList(car.transmissions);
  const driveTypes = parseList(car.driveTypes);
  const colors = parseList(car.colors);

  const features = car.additionalFeatures || {};
  const safety = parseList(features.safety);
  const interior = parseList(features.interior);
  const exterior = parseList(features.exterior);
  const technology = parseList(features.technology);
  const convenience = parseList(features.convenience);

  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-purple-200">
      {/* Tabs */}
      <div className="px-4 flex gap-6 border-b border-gray-200 text-sm">
        {["carDetails", "videos", "360", "features"].map((tab) => (
          <button
            key={tab}
            className={`py-2 px-3 font-semibold transition-colors ${
              activeTab === tab
                ? "text-purple-800 border-b-2 border-purple-800"
                : "text-gray-500 hover:text-purple-600"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "carDetails"
              ? "Car Details"
              : tab === "360"
              ? "360° View"
              : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="p-4">
        {/* Car Details */}
        {activeTab === "carDetails" && (
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col gap-2 w-full md:w-1/2">
              <img
                src={selectedImage}
                alt={car.modelName}
                className="w-full h-96 object-cover rounded-lg border border-purple-200"
              />
              <div className="flex gap-2 overflow-x-auto">
                {car.media?.images?.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={car.modelName}
                    onClick={() => setSelectedImage(img)}
                    className={`w-24 h-20 object-cover rounded-lg border cursor-pointer ${
                      selectedImage === img ? "border-purple-700" : "border-gray-200"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="w-full md:w-1/2 space-y-2">
              <h2 className="text-xl font-bold text-purple-800">
                {car.brand} {car.modelName} - {car.variant}
              </h2>
              <p className="text-gray-600">{car.bodyType}</p>
              <p className="text-lg font-semibold">
                ₹{car.priceRange.min / 100000} - ₹{car.priceRange.max / 100000} Lakhs
              </p>
              <p><strong>Fuel Types:</strong> {fuelTypes.join(", ")}</p>
              <p><strong>Transmissions:</strong> {transmissions.join(", ")}</p>
              <p><strong>Drive Types:</strong> {driveTypes.join(", ")}</p>
              <p><strong>Colors:</strong> {colors.join(", ")}</p>
              <p><strong>Stock:</strong> {car.stock}</p>
            </div>
          </div>
        )}

        {/* Videos */}
        {activeTab === "videos" && (
          <div>
            {car.media?.videos?.length > 0 ? (
              car.media.videos.map((vid, idx) => (
                <iframe
                  key={idx}
                  width="100%"
                  height="250"
                  src={vid.replace("watch?v=", "embed/")}
                  title={`Video ${idx}`}
                  className="rounded-lg border border-gray-300 my-2"
                  allowFullScreen
                ></iframe>
              ))
            ) : (
              <p className="text-gray-500">No videos available</p>
            )}
          </div>
        )}

        {/* 360 View */}
        {activeTab === "360" && (
          <div>
            {car.media?.model3D ? (
              <iframe
                width="100%"
                height="250"
                src={car.media.model3D}
                title="3D Model"
                className="rounded-lg border border-gray-300"
                allow="autoplay; fullscreen; vr"
                allowFullScreen
              ></iframe>
            ) : (
              <p className="text-gray-500">No 360° view available</p>
            )}
          </div>
        )}

        {/* Features */}
        {activeTab === "features" && (
          <div className="space-y-4">
            <h3 className="font-bold text-gray-800 text-lg">Features</h3>
            {Object.entries({
              Safety: safety,
              Interior: interior,
              Exterior: exterior,
              Technology: technology,
              Convenience: convenience,
            }).map(
              ([label, items]) =>
                items?.length > 0 && (
                  <div key={label}>
                    <p className="font-semibold text-gray-700 mb-2">{label}</p>
                    <div className="flex flex-wrap gap-2">
                      {items.map((item, idx) => (
                        <span
                          key={idx}
                          className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm border border-purple-200 shadow-sm"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CarViewPage;

import React, { useEffect, useState } from "react";
import axios from "axios";
import FooterForDealer from "./FooterForDealer";
import DealerNavBar from "./DealerNavBar";

const DealerDashboard = () => {
  const dealerData = localStorage.getItem("dealer");
  const dealer = dealerData ? JSON.parse(dealerData) : null;
  const token = localStorage.getItem("token");
  const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (dealer) {
      const fetchCars = async () => {
        try {
          const res = await axios.get(
            `${API_BASE}/api/newcars/dealer-cars/${dealer._id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setCars(res.data);
        } catch (err) {
          console.error("Error fetching dealer cars:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchCars();
    }
  }, [dealer, token]);

  if (!dealer) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold text-red-600">
          No dealer data found in localStorage.
        </h2>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/dealerLogin";
  };

  return (
    <div>
      <DealerNavBar isHomeDashboard={true} />
    <div className="p-6 bg-[#FAFAFA] min-h-screen mt-15">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-purple-800">{dealer.DealerName}</h1>
      </div>


      {loading ? (
        <p className="text-center">Loading cars...</p>
      ) : cars.length === 0 ? (
        <p className="text-center">No cars listed yet.</p>
      ) : (
        <div className="space-y-8">
          {cars.map((car) => (
            <CarCard key={car._id} car={car} />
          ))}
        </div>
      )}
    </div>
              <FooterForDealer/>

    </div>
  );
};

// ✅ Car Card Component
const CarCard = ({ car }) => {
  const [activeTab, setActiveTab] = useState("carDetails");
  const [selectedImage, setSelectedImage] = useState(car.media?.images?.[0] || "");

  const fuelTypes =
    car.fuelTypes?.[0]?.includes("|") ? car.fuelTypes[0].split("|") : car.fuelTypes;
  const transmissions =
    car.transmissions?.[0]?.includes("|") ? car.transmissions[0].split("|") : car.transmissions;
  const driveTypes =
    car.driveTypes?.[0]?.includes("|") ? car.driveTypes[0].split("|") : car.driveTypes;
  const colors =
    car.colors?.[0]?.includes("|") ? car.colors[0].split("|") : car.colors;

  const safety =
    car.additionalFeatures?.safety?.[0]?.includes("|")
      ? car.additionalFeatures.safety[0].split("|")
      : car.additionalFeatures?.safety;
  const interior =
    car.additionalFeatures?.interior?.[0]?.includes("|")
      ? car.additionalFeatures.interior[0].split("|")
      : car.additionalFeatures?.interior;
  const exterior =
    car.additionalFeatures?.exterior?.[0]?.includes("|")
      ? car.additionalFeatures.exterior[0].split("|")
      : car.additionalFeatures?.exterior;
  const technology =
    car.additionalFeatures?.technology?.[0]?.includes("|")
      ? car.additionalFeatures.technology[0].split("|")
      : car.additionalFeatures?.technology;
  const convenience =
    car.additionalFeatures?.convenience?.[0]?.includes("|")
      ? car.additionalFeatures.convenience[0].split("|")
      : car.additionalFeatures?.convenience;

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
            {tab === "carDetails" ? "Car Details" : tab === "360" ? "360° View" : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="p-4">
        {/* Car Details / Images */}
        {activeTab === "carDetails" && (
          <div className="flex gap-6">
            {/* Image Viewer */}
            <div className="flex flex-col gap-2 w-1/2">
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

            {/* Car Info */}
            <div className="w-1/2 space-y-2">
              <h2 className="text-xl font-bold text-purple-800">{car.brand} {car.modelName} - {car.variant}</h2>
              <p className="text-gray-600">{car.bodyType}</p>
              <p className="text-lg font-semibold">₹{car.priceRange.min/100000} - ₹{car.priceRange.max/100000} Lakhs</p>
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
                <div key={idx} className="mt-3">
                  <iframe
                    width="100%"
                    height="200"
                    src={vid.replace("watch?v=", "embed/")}
                    title={`Video ${idx}`}
                    className="rounded-lg border border-gray-300 h-150"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
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
                className="rounded-lg border border-gray-300 h-150"
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

  
export default DealerDashboard;

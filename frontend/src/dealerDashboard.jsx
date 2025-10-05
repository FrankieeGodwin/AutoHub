import React, { useEffect, useState } from "react";
import axios from "axios";

const DealerDashboard = () => {
  const dealerData = localStorage.getItem("dealer");
  const dealer = dealerData ? JSON.parse(dealerData) : null;
  const token = localStorage.getItem("token");

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (dealer) {
      const fetchCars = async () => {
        try {
          const res = await axios.get(
            `http://localhost:5000/api/newcars/dealer-cars/${dealer._id}`,
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

  return (
    <div className="p-6 bg-purple-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-purple-800">
        {dealer.DealerName}
      </h1>

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
  );
};

// ✅ Car Card Component
const CarCard = ({ car }) => {
  const [activeTab, setActiveTab] = useState("images");

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
      {/* Car Images */}
      {car.media?.images?.length > 0 && (
        <div className="flex gap-2 overflow-x-auto p-3 bg-purple-100">
          {car.media.images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={car.modelName}
              className="w-40 h-28 object-cover rounded-lg border border-purple-200"
            />
          ))}
        </div>
      )}

      {/* Car Header */}
      <div className="p-4">
        <h2 className="text-xl font-bold text-purple-800">
          {car.brand} {car.modelName} - {car.variant}
        </h2>
        <p className="text-gray-600">{car.bodyType}</p>
        <p className="text-lg font-semibold text-green-600">
          ₹{car.priceRange.min} - ₹{car.priceRange.max}
        </p>
      </div>

      {/* Tabs */}
      <div className="px-4 flex gap-6 border-b border-gray-200 text-sm">
        {["images", "videos", "360", "features"].map((tab) => (
          <button
            key={tab}
            className={`py-2 px-3 font-semibold transition-colors ${
              activeTab === tab
                ? "text-purple-800 border-b-2 border-purple-800"
                : "text-gray-500 hover:text-purple-600"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "360" ? "360° View" : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {activeTab === "images" && (
          <div className="space-y-2">
            <h3 className="font-bold text-purple-700">Car Details</h3>
            <p><strong>Fuel Types:</strong> {fuelTypes.join(", ")}</p>
            <p><strong>Transmissions:</strong> {transmissions.join(", ")}</p>
            <p><strong>Drive Types:</strong> {driveTypes.join(", ")}</p>
            <p><strong>Colors:</strong> {colors.join(", ")}</p>
            <p><strong>Stock:</strong> {car.stock}</p>
          </div>
        )}

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

{activeTab === "features" && (
  <div className="space-y-4">
    <h3 className="font-bold text-gray-800 text-lg">Features</h3>

    {/* Safety */}
    {safety?.length > 0 && (
      <div>
        <p className="font-semibold text-gray-700 mb-2">Safety</p>
        <div className="flex flex-wrap gap-2">
          {safety.map((item, idx) => (
            <span
              key={idx}
              className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm border border-purple-200 shadow-sm"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    )}

    {/* Interior */}
    {interior?.length > 0 && (
      <div>
        <p className="font-semibold text-gray-700 mb-2">Interior</p>
        <div className="flex flex-wrap gap-2">
          {interior.map((item, idx) => (
            <span
              key={idx}
              className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm border border-purple-200 shadow-sm"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    )}

    {/* Exterior */}
    {exterior?.length > 0 && (
      <div>
        <p className="font-semibold text-gray-700 mb-2">Exterior</p>
        <div className="flex flex-wrap gap-2">
          {exterior.map((item, idx) => (
            <span
              key={idx}
              className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm border border-purple-200 shadow-sm"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    )}

    {/* Technology */}
    {technology?.length > 0 && (
      <div>
        <p className="font-semibold text-gray-700 mb-2">Technology</p>
        <div className="flex flex-wrap gap-2">
          {technology.map((item, idx) => (
            <span
              key={idx}
              className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm border border-purple-200 shadow-sm"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    )}

    {/* Convenience */}
    {convenience?.length > 0 && (
      <div>
        <p className="font-semibold text-gray-700 mb-2">Convenience</p>
        <div className="flex flex-wrap gap-2">
          {convenience.map((item, idx) => (
            <span
              key={idx}
              className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm border border-purple-200 shadow-sm"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    )}
  </div>
)}

      </div>
    </div>
  );
};

export default DealerDashboard;

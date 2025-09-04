import React, { useState } from "react";
import axios from "axios";
import { useNavigate,useLocation } from "react-router-dom";

export default function CarUploadForm() {
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_BASE;
  const location = useLocation();
  const userId = location.state?.id;
  const [formData, setFormData] = useState({
    userId: userId,
    status: "available",
    make: "",
    model: "",
    price: "",
    regno: "",
    images: [],
    features: {
      engine: "",
      mileage: "",
      fuelType: "",
      transmission: "",
      seatingCapacity: "",
      bodyType: "",
      color: "",
      yearOfManufacture: "",
      driveType: "",
    },
    carDetails: {
      age: "",
      distanceTravelled: "",
      numberOfOwners: "",
    },
    location: {
      country: "",
      state: "",
      city: "",
    },
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  // Handle text inputs
  const handleChange = (e, section, field) => {
    if (section) {
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: e.target.value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    }
  };

  // Handle file input
  const handleFileChange = (e) => {
    setSelectedFiles([...e.target.files]);
  };

  // Submit
  // Submit
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    let uploadedImages = [];

    if (selectedFiles.length > 0) {
      const uploadData = new FormData();
      selectedFiles.forEach((file) => uploadData.append("images", file));

      const uploadRes = await axios.post(
        `${API_BASE}/uploadApi/upload-images`,
        uploadData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      // ✅ Check response status
      if (uploadRes.status !== 200) {
        console.error("Image upload failed:", uploadRes);
        alert("Image upload failed. Please try again.");
        setLoading(false);
        return; // stop execution here
      }

      // ✅ Log all URLs from API
      console.log("Uploaded image URLs:", uploadRes.data.urls);

      uploadedImages = uploadRes.data.urls; 
    }

    const finalData = { ...formData, images: uploadedImages };

    const carRes = await axios.post(`${API_BASE}/cars`, finalData);

    // ✅ Stop if car upload failed
    if (carRes.status !== 201) {
      console.error("Car save failed:", carRes);
      alert("Car save failed. Please try again.");
      setLoading(false);
      return;
    }

    alert("Car uploaded successfully!");
    navigate("/");
  } catch (err) {
    console.error("Upload error:", err);
    alert("Failed to upload car.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="w-full min-h-screen bg-[#FAFAFA] flex items-center justify-center py-10">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-4xl border border-gray-200">
        <h2 className="text-3xl font-bold text-purple-700 mb-8 text-center">
          Add New Car 
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 gap-4">
            <input
              name="make"
              placeholder="Make"
              value={formData.make}
              onChange={handleChange}
              className="px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <input
              name="model"
              placeholder="Model"
              value={formData.model}
              onChange={handleChange}
              className="px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <input
              name="price"
              type="number"
              placeholder="Price"
              value={formData.price}
              onChange={handleChange}
              className="px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <input
              name="regno"
              placeholder="Registration Number"
              value={formData.regno}
              onChange={handleChange}
              className="px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          {/* Features */}
          <h3 className="text-xl font-semibold text-gray-800">Features</h3>
          <div className="grid grid-cols-1 gap-4">
            <input placeholder="Engine" value={formData.features.engine} onChange={(e) => handleChange(e, "features", "engine")} className="px-4 py-3 rounded-xl border border-gray-300"/>
            <input placeholder="Mileage" value={formData.features.mileage} onChange={(e) => handleChange(e, "features", "mileage")} className="px-4 py-3 rounded-xl border border-gray-300"/>
            <input placeholder="Fuel Type" value={formData.features.fuelType} onChange={(e) => handleChange(e, "features", "fuelType")} className="px-4 py-3 rounded-xl border border-gray-300"/>
            <input placeholder="Transmission" value={formData.features.transmission} onChange={(e) => handleChange(e, "features", "transmission")} className="px-4 py-3 rounded-xl border border-gray-300"/>
            <input placeholder="Seating Capacity" value={formData.features.seatingCapacity} onChange={(e) => handleChange(e, "features", "seatingCapacity")} className="px-4 py-3 rounded-xl border border-gray-300"/>
            <input placeholder="Body Type" value={formData.features.bodyType} onChange={(e) => handleChange(e, "features", "bodyType")} className="px-4 py-3 rounded-xl border border-gray-300"/>
            <input placeholder="Color" value={formData.features.color} onChange={(e) => handleChange(e, "features", "color")} className="px-4 py-3 rounded-xl border border-gray-300"/>
            <input placeholder="Year of Manufacture" value={formData.features.yearOfManufacture} onChange={(e) => handleChange(e, "features", "yearOfManufacture")} className="px-4 py-3 rounded-xl border border-gray-300"/>
            <input placeholder="Drive Type" value={formData.features.driveType} onChange={(e) => handleChange(e, "features", "driveType")} className="px-4 py-3 rounded-xl border border-gray-300"/>
          </div>

          {/* Car Details */}
          <h3 className="text-xl font-semibold text-gray-800">Car Details</h3>
          <div className="grid grid-cols-1 gap-4">
            <input placeholder="Age" value={formData.carDetails.age} onChange={(e) => handleChange(e, "carDetails", "age")} className="px-4 py-3 rounded-xl border border-gray-300"/>
            <input placeholder="Distance Travelled" value={formData.carDetails.distanceTravelled} onChange={(e) => handleChange(e, "carDetails", "distanceTravelled")} className="px-4 py-3 rounded-xl border border-gray-300"/>
            <input placeholder="Number of Owners" value={formData.carDetails.numberOfOwners} onChange={(e) => handleChange(e, "carDetails", "numberOfOwners")} className="px-4 py-3 rounded-xl border border-gray-300"/>
          </div>

          {/* Location */}
          <h3 className="text-xl font-semibold text-gray-800">Location</h3>
          <div className="grid grid-cols-1 gap-4">
            <input placeholder="Country" value={formData.location.country} onChange={(e) => handleChange(e, "location", "country")} className="px-4 py-3 rounded-xl border border-gray-300"/>
            <input placeholder="State" value={formData.location.state} onChange={(e) => handleChange(e, "location", "state")} className="px-4 py-3 rounded-xl border border-gray-300"/>
            <input placeholder="City" value={formData.location.city} onChange={(e) => handleChange(e, "location", "city")} className="px-4 py-3 rounded-xl border border-gray-300"/>
          </div>

          {/* Images */}
          <h3 className="text-xl font-semibold text-gray-800">Upload Images</h3>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white"
          />

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition duration-300"
          >
            {loading ? "Uploading..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}

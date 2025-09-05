import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { State, City } from "country-state-city";

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
      country: "India",
      state: "",
      city: "",
    },
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateField = (section, name, value) => {
    let error = "";

    if (section === null) {
      if (name === "make" && !value) error = "Please enter a car make";
      if (name === "model" && !value) error = "Please enter a car model";
      if (name === "price") {
        if (!value) error = "Price is required";
        else if (isNaN(value)) error = "Price must be a number";
        else if (value <= 0) error = "Price must be positive";
      }
      if (name === "regno") {
        const regPattern = /^[A-Z]{2}\s\d{2}\s[A-Z]{2}\s\d{4}$/;
        if (!regPattern.test(value)) error = "Format must be TN 72 BB 4234";
      }
    }

    if (section === "features") {
      if (name === "mileage" && value && !/^[0-9]+$/.test(value))
        error = "Mileage must be a number";
      if (name === "seatingCapacity" && value && !/^[0-9]+$/.test(value))
        error = "Seating Capacity must be a number";
      if (name === "yearOfManufacture" && value && !/^\d{4}$/.test(value))
        error = "Enter a valid year (e.g. 2020)";
    }

    if (section === "carDetails") {
      if (name === "age" && value && isNaN(value)) error = "Age must be a number";
      if (name === "distanceTravelled" && value && isNaN(value))
        error = "Distance must be a number";
      if (name === "numberOfOwners" && value && !/^[0-9]+$/.test(value))
        error = "Enter valid number of owners";
    }

    return error;
  };

  const handleChange = (e, section, field) => {
    const { name, value } = e.target;
    if (section) {
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      }));
      setErrors((prev) => ({
        ...prev,
        [`${section}.${field}`]: validateField(section, field, value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(null, name, value),
      }));
    }
  };

  const handleFileChange = (e) => {
    setSelectedFiles([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let tempErrors = {};
    Object.keys(formData).forEach((key) => {
      if (typeof formData[key] === "string") {
        tempErrors[key] = validateField(null, key, formData[key]);
      } else if (typeof formData[key] === "object") {
        Object.keys(formData[key]).forEach((subKey) => {
          tempErrors[`${key}.${subKey}`] = validateField(
            key,
            subKey,
            formData[key][subKey]
          );
        });
      }
    });
    setErrors(tempErrors);

    if (Object.values(tempErrors).some((err) => err)) {
      alert("Please fix validation errors before submitting");
      setLoading(false);
      return;
    }

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

        if (uploadRes.status !== 200) {
          alert("Image upload failed. Please try again.");
          setLoading(false);
          return;
        }

        uploadedImages = uploadRes.data.urls;
      }

      const finalData = { ...formData, images: uploadedImages };

      const carRes = await axios.post(`${API_BASE}/cars`, finalData);

      if (carRes.status !== 201) {
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

  const featureFields = [
    { name: "engine", label: "Engine" },
    { name: "mileage", label: "Mileage" },
    { name: "fuelType", label: "Fuel Type" },
    { name: "transmission", label: "Transmission" },
    { name: "seatingCapacity", label: "Seating Capacity" },
    { name: "bodyType", label: "Body Type" },
    { name: "color", label: "Color" },
    { name: "yearOfManufacture", label: "Year of Manufacture" },
    { name: "driveType", label: "Drive Type" },
  ];

  const carDetailsFields = [
    { name: "age", label: "Age" },
    { name: "distanceTravelled", label: "Distance Travelled" },
    { name: "numberOfOwners", label: "Number of Owners" },
  ];

  return (
    <div className="w-full min-h-screen bg-[#FAFAFA] flex items-center justify-center py-10">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-4xl border border-gray-200">
        <h2 className="text-3xl font-bold text-purple-700 mb-8 text-center">
          Add New Car
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* ---------------- BASIC INFO ---------------- */}
          <h3 className="text-xl font-semibold text-gray-800">Basic Info</h3>
          <div className="grid grid-cols-1 gap-4">
            {/* Make */}
            <div className="flex flex-col gap-1">
              <label className="text-base font-semibold text-gray-800 text-left px-5">
                Make
              </label>
              <input
                name="make"
                type="text"
                placeholder="Enter make"
                value={formData.make}
                onChange={handleChange}
                className="px-4 py-3 border border-gray-300"
              />
              {errors.make && <p className="text-red-500 text-sm px-5">{errors.make}</p>}
            </div>

            {/* Model */}
            <div className="flex flex-col gap-1">
              <label className="text-base font-semibold text-gray-800 text-left px-5">
                Model
              </label>
              <input
                name="model"
                type="text"
                placeholder="Enter model"
                value={formData.model}
                onChange={handleChange}
                className="px-4 py-3 border border-gray-300"
              />
              {errors.model && <p className="text-red-500 text-sm px-5">{errors.model}</p>}
            </div>

            {/* Price */}
            <div className="flex flex-col gap-1">
              <label className="text-base font-semibold text-gray-800 text-left px-5">
                Price
              </label>
              <input
                name="price"
                type="number"
                placeholder="Enter price"
                value={formData.price}
                onChange={handleChange}
                className="px-4 py-3 border border-gray-300"
              />
              {errors.price && <p className="text-red-500 text-sm px-5">{errors.price}</p>}
            </div>

            {/* Registration */}
            <div className="flex flex-col gap-1">
              <label className="text-base font-semibold text-gray-800 text-left px-5">
                Registration Number
              </label>
              <input
                name="regno"
                type="text"
                placeholder="TN 72 BB 4234"
                value={formData.regno}
                onChange={handleChange}
                className="px-4 py-3 border border-gray-300"
              />
              {errors.regno && <p className="text-red-500 text-sm px-5">{errors.regno}</p>}
            </div>
          </div>

          {/* ---------------- FEATURES ---------------- */}
          <h3 className="text-xl font-semibold text-gray-800">Features</h3>
          <div className="grid grid-cols-1 gap-4">
            {featureFields.map((f) => (
              <div key={f.name} className="flex flex-col gap-1">
                <label className="text-base font-semibold text-gray-800 text-left px-5">
                  {f.label}
                </label>
                <input
                  placeholder={f.label}
                  value={formData.features[f.name]}
                  onChange={(e) => handleChange(e, "features", f.name)}
                  className="px-4 py-3 border border-gray-300"
                />
                {errors[`features.${f.name}`] && (
                  <p className="text-red-500 text-sm px-5">
                    {errors[`features.${f.name}`]}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* ---------------- CAR DETAILS ---------------- */}
          <h3 className="text-xl font-semibold text-gray-800">Car Details</h3>
          <div className="grid grid-cols-1 gap-4">
            {carDetailsFields.map((f) => (
              <div key={f.name} className="flex flex-col gap-1">
                <label className="text-base font-semibold text-gray-800 text-left px-5">
                  {f.label}
                </label>
                <input
                  placeholder={f.label}
                  value={formData.carDetails[f.name]}
                  onChange={(e) => handleChange(e, "carDetails", f.name)}
                  className="px-4 py-3 border border-gray-300"
                />
                {errors[`carDetails.${f.name}`] && (
                  <p className="text-red-500 text-sm px-5">
                    {errors[`carDetails.${f.name}`]}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* ---------------- LOCATION ---------------- */}
          <h3 className="text-xl font-semibold text-gray-800">Location</h3>
          <div className="grid grid-cols-1 gap-4">
            {/* Country */}
            <div className="flex flex-col gap-1">
              <label className="text-base font-semibold text-gray-800 text-left px-5">
                Country
              </label>
              <input
                value="India"
                readOnly
                className="px-4 py-3 border border-gray-300 bg-gray-100"
              />
            </div>

            {/* State */}
            <div className="flex flex-col gap-1">
              <label className="text-base font-semibold text-gray-800 text-left px-5">
                State
              </label>
              <select
                value={formData.location.state}
                onChange={(e) => handleChange(e, "location", "state")}
                className="px-4 py-3 border border-gray-300"
              >
                <option value="">Select State</option>
                {State.getStatesOfCountry("IN").map((st) => (
                  <option key={st.isoCode} value={st.isoCode}>
                    {st.name}
                  </option>
                ))}
              </select>
              {errors["location.state"] && (
                <p className="text-red-500 text-sm px-5">{errors["location.state"]}</p>
              )}
            </div>

            {/* City */}
            <div className="flex flex-col gap-1">
              <label className="text-base font-semibold text-gray-800 text-left px-5">
                City
              </label>
              <select
                value={formData.location.city}
                onChange={(e) => handleChange(e, "location", "city")}
                className="px-4 py-3 border border-gray-300"
                disabled={!formData.location.state}
              >
                <option value="">Select City</option>
                {formData.location.state &&
                  City.getCitiesOfState("IN", formData.location.state).map((ct) => (
                    <option key={ct.name} value={ct.name}>
                      {ct.name}
                    </option>
                  ))}
              </select>
              {errors["location.city"] && (
                <p className="text-red-500 text-sm px-5">{errors["location.city"]}</p>
              )}
            </div>
          </div>

          {/* ---------------- IMAGES ---------------- */}
          <h3 className="text-xl font-semibold text-gray-800">Upload Images</h3>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="w-full px-4 py-3 border border-gray-300 bg-white"
          />

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 bg-purple-600 text-white font-semibold hover:bg-purple-700"
          >
            {loading ? "Uploading..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}

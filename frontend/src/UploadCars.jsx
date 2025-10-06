import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import FooterForDealer from "./FooterForDealer.jsx";
import DealerNavBar from "./DealerNavBar.jsx";
const UploadCars = () => {
  const dealerData = localStorage.getItem("dealer");
  const dealer = dealerData ? JSON.parse(dealerData) : null;
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const navigate=useNavigate();
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !dealer?._id) {
      setMessage("Please select a file and ensure dealer is logged in.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        `http://localhost:5000/api/newcars/upload-newcars/${dealer._id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setMessage(`${res.data.message}`);
      navigate("/dealerDashboard");

    } catch (err) {
      console.error("Error uploading file:", err);
      setMessage("Error uploading file.");
    }
  };

  return (
    <div className="min-h-screen">
        <DealerNavBar isHomeDashboard={false} />
    <div className="flex flex-col items-center justify-center bg-[#FAFAFA] mt-15 h-120 p-6">
      <h2 className="text-3xl font-bold text-purple-800 mb-6">Upload New Cars</h2>

      <form
        onSubmit={handleUpload}
        className="bg-white shadow-md rounded-lg p-8 w-full max-w-md border border-purple-200"
      >
        <label className="block text-purple-700 font-semibold mb-3">
          Select CSV File
        </label>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="w-full mb-5 border border-gray-300 rounded p-2"
        />
        <button
          type="submit"
          className="w-full bg-purple-700 text-white py-2 rounded-lg hover:bg-purple-800 transition"
        >
          Upload
        </button>
      </form>

      {message && (
        <p className="mt-4 text-center text-gray-700 font-semibold">{message}</p>
      )}
    </div>
    <FooterForDealer/>
    </div>
  );
};

export default UploadCars;

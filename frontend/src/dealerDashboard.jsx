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
    <div className="p-6 max-w-5xl mx-auto bg-white shadow-lg rounded-2xl">
      <h1 className="text-2xl font-bold mb-6 text-center">Dealer Dashboard</h1>

      <div className="space-y-3 mb-6">
        <p><span className="font-semibold">Dealer ID:</span> {dealer._id}</p>
        <p><span className="font-semibold">Name:</span> {dealer.DealerName}</p>
        <p><span className="font-semibold">Email:</span> {dealer.Email}</p>
        <p><span className="font-semibold">Phone:</span> {dealer.PhoneNumber}</p>
        <p><span className="font-semibold">Business License:</span> {dealer.BusinessLicenseNumber}</p>
        <p><span className="font-semibold">GST Number:</span> {dealer.GSTNumber}</p>
        <p><span className="font-semibold">Created At:</span> {new Date(dealer.createdAt).toLocaleString()}</p>
        <p><span className="font-semibold">Updated At:</span> {new Date(dealer.updatedAt).toLocaleString()}</p>
      </div>

      <h2 className="text-xl font-bold mb-4">Cars Listed</h2>
      {loading ? (
        <p>Loading cars...</p>
      ) : cars.length === 0 ? (
        <p>No cars listed yet.</p>
      ) : (
        <div className="space-y-6">
          {cars.map((car) => {
            // Fix the arrays from backend strings
            const fuelTypes = car.fuelTypes?.[0]?.includes("|") ? car.fuelTypes[0].split("|") : car.fuelTypes;
            const transmissions = car.transmissions?.[0]?.includes("|") ? car.transmissions[0].split("|") : car.transmissions;
            const driveTypes = car.driveTypes?.[0]?.includes("|") ? car.driveTypes[0].split("|") : car.driveTypes;
            const colors = car.colors?.[0]?.includes("|") ? car.colors[0].split("|") : car.colors;

            const safety = car.additionalFeatures?.safety?.[0]?.includes("|") ? car.additionalFeatures.safety[0].split("|") : car.additionalFeatures?.safety;
            const interior = car.additionalFeatures?.interior?.[0]?.includes("|") ? car.additionalFeatures.interior[0].split("|") : car.additionalFeatures?.interior;
            const exterior = car.additionalFeatures?.exterior?.[0]?.includes("|") ? car.additionalFeatures.exterior[0].split("|") : car.additionalFeatures?.exterior;
            const technology = car.additionalFeatures?.technology?.[0]?.includes("|") ? car.additionalFeatures.technology[0].split("|") : car.additionalFeatures?.technology;
            const convenience = car.additionalFeatures?.convenience?.[0]?.includes("|") ? car.additionalFeatures.convenience[0].split("|") : car.additionalFeatures?.convenience;

            return (
              <div key={car._id} className="border p-4 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold">{car.brand} {car.modelName} - {car.variant}</h3>
                <p><strong>Body Type:</strong> {car.bodyType}</p>
                <p><strong>Fuel Types:</strong> {fuelTypes.join(", ")}</p>
                <p><strong>Transmissions:</strong> {transmissions.join(", ")}</p>
                <p><strong>Drive Types:</strong> {driveTypes.join(", ")}</p>
                <p><strong>Colors:</strong> {colors.join(", ")}</p>
                <p><strong>Price:</strong> ₹{car.priceRange.min} - ₹{car.priceRange.max}</p>
                <p><strong>Stock:</strong> {car.stock}</p>

                <h4 className="font-semibold mt-2">Engines:</h4>
                {car.engines.map((engine, idx) => (
                  <p key={idx}>
                    {engine.engineType} - {engine.displacement} cc, {engine.power} bhp, {engine.torque} Nm, {engine.cylinders} cylinders, {engine.fuelEfficiency} km/l
                  </p>
                ))}

                <h4 className="font-semibold mt-2">Features:</h4>
                <p><strong>Safety:</strong> {safety?.join(", ")}</p>
                <p><strong>Interior:</strong> {interior?.join(", ")}</p>
                <p><strong>Exterior:</strong> {exterior?.join(", ")}</p>
                <p><strong>Technology:</strong> {technology?.join(", ")}</p>
                <p><strong>Convenience:</strong> {convenience?.join(", ")}</p>

                {car.media?.images?.length > 0 && (
                  <div className="mt-2 flex gap-2 overflow-x-auto">
                    {car.media.images.map((img, i) => (
                      <img key={i} src={img} alt={car.modelName} className="w-48 h-32 object-cover rounded-lg" />
                    ))}
                  </div>
                )}

                {car.media?.videos?.length > 0 && car.media.videos.map((vid, idx) => (
                  <div key={idx} className="mt-2">
                    <iframe
                      width="100%"
                      height="250"
                      src={vid.replace("watch?v=", "embed/")}
                      title={`Video ${idx}`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                ))}

                {car.media?.model3D && (
  <div className="mt-2">
    <iframe
      width="100%"
      height="300"
      src={car.media.model3D}   // directly use DB link
      title="3D Model"
      frameBorder="0"
      allow="autoplay; fullscreen; vr"
      allowFullScreen
    ></iframe>
  </div>
)}


              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DealerDashboard;

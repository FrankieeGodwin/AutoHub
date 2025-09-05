import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

function CarView() {
  const location = useLocation();
  const userId = location.state?.userId;
  const carId = location.state?.carId;

  const [car, setCar] = useState(null);
  const [features, setFeatures] = useState(null);
  const [details, setDetails] = useState(null);
  const [images, setImages] = useState([]);
  const [locationData, setLocationData] = useState(null);
  console.log(userId,carId);
  // useEffect(() => {
  //   if (!carId) return;

  //   const fetchCarData = async () => {
  //     try {
  //       const [mainRes, featuresRes, detailsRes, imagesRes, locationRes] =
  //         await Promise.all([
  //           axios.get(`http://localhost:5000/main/${carId}`),
  //           axios.get(`http://localhost:5000/features/${carId}`),
  //           axios.get(`http://localhost:5000/details/${carId}`),
  //           axios.get(`http://localhost:5000/images/${carId}`),
  //           axios.get(`http://localhost:5000/location/${carId}`),
  //         ]);

  //       setCar(mainRes.data);
  //       setFeatures(featuresRes.data);
  //       setDetails(detailsRes.data);
  //       setImages(imagesRes.data);
  //       setLocationData(locationRes.data);
  //     } catch (err) {
  //       console.error("Error fetching car data:", err);
  //     }
  //   };

  //   fetchCarData();
  // }, [carId]);

  // if (!car) return <p className="text-center mt-10">Loading car details...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4">
        {car.make} {car.model}
      </h1>

      {/* Car Images */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {images.length > 0 ? (
          images.map((img, index) => (
            <img
              key={index}
              src={img.imageURL}
              alt={`Car ${index}`}
              className="w-full h-48 object-cover rounded-md shadow-md"
            />
          ))
        ) : (
          <p>No images available</p>
        )}
      </div>

      {/* Main Car Info */}
      <div className="mb-4">
        <p className="text-gray-700">
          <strong>Price:</strong> ₹{car.price}
        </p>
        <p className="text-gray-700">
          <strong>Status:</strong> {car.status}
        </p>
        <p className="text-gray-700">
          <strong>Registration No:</strong> {car.regno}
        </p>
      </div>

      {/* Features */}
      {features && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Features</h2>
          <p>Engine: {features.engine}</p>
          <p>Mileage: {features.mileage}</p>
          <p>Fuel Type: {features.fuelType}</p>
          <p>Transmission: {features.transmission}</p>
          <p>Seating Capacity: {features.seatingCapacity}</p>
          <p>Body Type: {features.bodyType}</p>
          <p>Color: {features.color}</p>
          <p>Year: {features.yearOfManufacture}</p>
          <p>Drive Type: {features.driveType}</p>
        </div>
      )}

      {/* Car Details */}
      {details && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Car Details</h2>
          <p>Age: {details.age} years</p>
          <p>Distance Travelled: {details.distanceTravelled} km</p>
          <p>Number of Owners: {details.numberOfOwners}</p>
        </div>
      )}

      {/* Location */}
      {locationData && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Location</h2>
          <p>Country: {locationData.country}</p>
          <p>State: {locationData.state}</p>
          <p>City: {locationData.city}</p>
        </div>
      )}

      {/* Hidden User ID */}
      <p className="text-sm text-gray-400">User ID: {userId}</p>
    </div>
  );
}

export default CarView;

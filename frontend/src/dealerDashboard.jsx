import React from "react";

const DealerDashboard = () => {
  // Get dealer data from localStorage
  const dealerData = localStorage.getItem("dealer");
  const dealer = dealerData ? JSON.parse(dealerData) : null;
  const token = localStorage.getItem("token");
  console.log(token);
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
    <div className="p-6 max-w-2xl mx-auto bg-white shadow-lg rounded-2xl">
      <h1 className="text-2xl font-bold mb-4 text-center">Dealer Dashboard</h1>
      <div className="space-y-3">
        <p><span className="font-semibold">Dealer ID:</span> {dealer._id}</p>
        <p><span className="font-semibold">Name:</span> {dealer.DealerName}</p>
        <p><span className="font-semibold">Email:</span> {dealer.Email}</p>
        <p><span className="font-semibold">Phone:</span> {dealer.PhoneNumber}</p>
        <p><span className="font-semibold">Business License:</span> {dealer.BusinessLicenseNumber}</p>
        <p><span className="font-semibold">GST Number:</span> {dealer.GSTNumber}</p>
        <p><span className="font-semibold">Cars Listed:</span> {dealer.CarsListed?.length || 0}</p>
        <p><span className="font-semibold">Created At:</span> {new Date(dealer.createdAt).toLocaleString()}</p>
        <p><span className="font-semibold">Updated At:</span> {new Date(dealer.updatedAt).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default DealerDashboard;

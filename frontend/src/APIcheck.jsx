import React, { useState, useEffect } from "react";

const APIcheck = () => {
  const [allData, setAllData] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedState, setSelectedState] = useState("");

  // Fetch state + district data from local JSON
  useEffect(() => {
    fetch("/cities.json")
      .then((res) => res.json())
      .then((data) => {
        // Keep only State and District, trim spaces
        const simplifiedData = data.map((item) => ({
          State: item.State.trim(),
          District: item.District.trim(),
        }));

        setAllData(simplifiedData);

        // Extract unique states and sort alphabetically
        const uniqueStates = [...new Set(simplifiedData.map((item) => item.State))].sort();
        setStates(uniqueStates);
      })
      .catch((err) => console.error("Failed to fetch data:", err));
  }, []);

  // Update districts when a state is selected
  useEffect(() => {
    if (selectedState) {
      const filteredDistricts = allData
        .filter((item) => item.State === selectedState)
        .map((item) => item.District);

      setDistricts([...new Set(filteredDistricts)].sort());
    } else {
      setDistricts([]);
    }
  }, [selectedState, allData]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Select State & District</h2>

        {/* State Dropdown */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">State</label>
          <select
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400"
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
          >
            <option value="">Select State</option>
            {states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        {/* District Dropdown */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">District</label>
          <select
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400"
            disabled={!selectedState} // disable until state is selected
          >
            <option value="">
              {selectedState ? "Select District" : "Select State First"}
            </option>
            {districts.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default APIcheck;

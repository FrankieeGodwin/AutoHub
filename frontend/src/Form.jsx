import { useState } from "react";
import { useNavigate } from "react-router-dom"
function Form() {
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    price: "",
    status: "Available",
    regno: "",
    age: "",
    distanceTravelled: "",
    numberOfOwners: "",
    images: [],
  });

  const navigate=useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const files=Array.from(e.target.files);
    setFormData({
      ...formData,
      image: files,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // append text fields
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key !== "images") {
        data.append(key, formData[key]);
      }
    });

    // append images one by one
    formData.images.forEach((img, index) => {
      data.append("images", img);
    });

    console.log("Form submitted:", formData);
  //  navigate("/Home");
    // 👉 Here you can send to backend using fetch or axios
    // axios.post("/api/cars", data, { headers: { "Content-Type": "multipart/form-data" } })
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white-800 via-purple-500 to-pink-500">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-[400px] space-y-4"
        encType="multipart/form-data"
      >
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">
          Add Car Details 🚗
        </h2>

        <input
          type="text"
          name="make"
          placeholder="Car Make (e.g. Toyota)"
          value={formData.make}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <input
          type="text"
          name="model"
          placeholder="Car Model (e.g. Corolla)"
          value={formData.model}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />


        <input
          type="text"
          name="regno"
          placeholder="Registration Number"
          value={formData.regno}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <input
          type="number"
          name="age"
          placeholder="Car Age (Years)"
          value={formData.age}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <input
          type="number"
          name="distanceTravelled"
          placeholder="Distance Travelled (km)"
          value={formData.distanceTravelled}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <input
          type="number"
          name="numberOfOwners"
          placeholder="Number of Owners"
          value={formData.numberOfOwners}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        {/* Multiple image input */}
        <input
          type="file"
          name="images"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="w-full p-2 border rounded-lg"
        />

        {/* Preview selected images */}
        <div className="flex flex-wrap gap-2">
          {formData.images.length > 0 &&
            formData.images.map((img, index) => (
              <img
                key={index}
                src={URL.createObjectURL(img)}
                alt="preview"
                className="w-16 h-16 object-cover rounded-lg border"
              />
            ))}
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-500 text-white py-3 rounded-lg font-semibold hover:bg-indigo-600 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default Form;

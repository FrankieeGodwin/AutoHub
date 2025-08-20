import React from "react";

function Carview(){
    const cars = [
    {
      id: 1,
      name: "Tesla Model S",
      price: "$80,000",
      img: "https://tesla-cdn.thron.com/delivery/public/image/tesla/29bcb9cf-739b-44a7-a5b1-dc97c735c1b7/bvlatuR/std/1920x1080/Desktop-ModelS",
    },
    {
      id: 2,
      name: "BMW i8",
      price: "$140,000",
      img: "https://www.bmwusa.com/content/dam/bmwusa/common/vehicles/2020/my20-i8-coupe/m20-i8-coupe-overview-desktop.jpg",
    },
    {
      id: 3,
      name: "Audi R8",
      price: "$170,000",
      img: "https://www.audi.com/content/dam/ci/Models/R8/r8-spyder.jpg",
    },
    {
      id: 4,
      name: "Mercedes AMG GT",
      price: "$150,000",
      img: "https://www.mercedes-benz.com/en/vehicles/passenger-cars/amg-gt/_jcr_content/image/MQ7-0-image-20201002152331/01-mercedes-amg-gt-4-door-coupe-2020-3400x1440.jpeg",
    },
    {
      id: 5,
      name: "Lamborghini Huracan",
      price: "$210,000",
      img: "https://www.lamborghini.com/sites/it-en/files/DAM/lamborghini/gateway-family/huracan/huracan-evo/huracan-evo-og.jpg",
    },
    {
      id: 6,
      name: "Porsche 911",
      price: "$120,000",
      img: "https://files.porsche.com/filestore/image/multimedia/none/992-carrera-modelimage-sideshot/model/616e55e9-fd9f-11e9-80c4-005056bbdc38/porsche-model.png",
    },
  ];
    return(
        <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Cars</h1>

      {/* Step 2: Loop through cars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {cars.map((car) => (
          <div
            key={car.id}
            className="bg-white shadow-lg rounded-2xl p-4 hover:scale-105 transition"
          >
            <img
              src={car.img}
              alt={car.name}
              className="w-full h-48 object-cover rounded-lg"
            />
            <h2 className="text-xl font-semibold mt-3">{car.name}</h2>
            <p className="text-gray-600">{car.price}</p>
            <button className="mt-3 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
    );
}

export default Carview;
import multer from "multer";
import csv from "csv-parser";
import fs from "fs";
import NewCar from "../models/NewCar.model.js";

const upload = multer({ dest: "uploads/" });

export const uploadCSV = [
  upload.single("file"),
  (req, res) => {
    const dealerId = req.params.dealerId; // get dealer from URL
    if (!dealerId) return res.status(400).json({ error: "Dealer ID is required in params" });

    const results = [];

    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (row) => {
        results.push({
          brand: row.brand,
          modelName: row.modelName,
          variant: row.variant,
          bodyType: row.bodyType,
          fuelTypes: row.fuelTypes.split(","),
          transmissions: row.transmissions.split(","),
          driveTypes: row.driveTypes.split(","),
          colors: row.colors.split(","),
          engines: [{
            engineType: row.engineType,
            displacement: Number(row.displacement),
            power: row.power,
            torque: row.torque,
            cylinders: Number(row.cylinders),
            fuelEfficiency: row.fuelEfficiency
          }],
          dimensions: {
            length: Number(row.length),
            width: Number(row.width),
            height: Number(row.height),
            wheelbase: Number(row.wheelbase),
            groundClearance: Number(row.groundClearance),
            bootSpace: Number(row.bootSpace),
            seatingCapacity: Number(row.seatingCapacity),
          },
          priceRange: {
            min: Number(row.priceMin),
            max: Number(row.priceMax),
          },
          additionalFeatures: {
            safety: row.safety.split(","),
            interior: row.interior.split(","),
            exterior: row.exterior.split(","),
            technology: row.technology.split(","),
            convenience: row.convenience.split(","),
          },
          media: {
            images: row.images.split("|"),
            videos: row.videos.split("|"),
            model3D: row.model3D,
          },
          dealer: dealerId // assign dealer from URL
        });
      })
      .on("end", async () => {
        try {
          await NewCar.insertMany(results);
          res.json({ message: "CSV data imported successfully", count: results.length });
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      });
  }
];

export const getDealerCars = async (req, res) => {
  const dealerId = req.params.dealerId;
  if (!dealerId) return res.status(400).json({ error: "Dealer ID is required" });

  try {
    const cars = await NewCar.find({ dealer: dealerId });
    res.json(cars);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const getAllCars = async (req,res) => {
  try{
  const car = await NewCar.find();
  if(!car || car.length === 0)
  {
    return res.status(404).json({error : "No cars found"});
  }
  res.status(200).json({
      success: true,
      totalCars: car.length,
      car,
    });
  }
  catch(error)
  {
    console.error("Error fetching all cars:", error.message);
    res.status(500).json({ success: false, error: error.message });
    res.status(500).json({error : error.message});
  }

}

export const getCarById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find car by ID and populate dealer details (if needed)
    const car = await NewCar.findById(id).populate("dealer", "DealerName email phone");

    if (!car) {
      return res.status(404).json({ success: false, message: "Car not found" });
    }

    return res.status(200).json({
      success: true,
      car,
    });
  } catch (error) {
    console.error("Error fetching car by ID:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching car details",
      error: error.message,
    });
  }
};
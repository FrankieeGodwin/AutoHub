import mongoose from "mongoose";

const featuresSchema = new mongoose.Schema({
  carId: { type: mongoose.Schema.Types.ObjectId, ref: "Car", required: true },
  engine: String,
  mileage: String,
  fuelType: String,
  transmission: String,
  seatingCapacity: Number,
  bodyType: String,
  color: String,
  yearOfManufacture: Number,
  driveType: String
});

export default mongoose.model("Features", featuresSchema);

import mongoose from "mongoose";

const carDetailsSchema = new mongoose.Schema({
  carId: { type: mongoose.Schema.Types.ObjectId, ref: "Car", required: true },
  age: Number,
  distanceTravelled: Number,
  numberOfOwners: Number
});

export default mongoose.model("CarDetails", carDetailsSchema);

import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
  carId: { type: mongoose.Schema.Types.ObjectId, ref: "Car", required: true },
  country: String,
  state: String,
  city: String
});

export default mongoose.model("Location", locationSchema);

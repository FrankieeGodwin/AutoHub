import mongoose from "mongoose";

const imagesSchema = new mongoose.Schema({
  carId: { type: mongoose.Schema.Types.ObjectId, ref: "Car", required: true },
  imageURL: { type: String, required: true }
});

export default mongoose.model("Images", imagesSchema);

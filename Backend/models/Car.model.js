import mongoose from "mongoose";

const carSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  }, 
  make: { type: String, required: true },
  model: { type: String, required: true },
  price: { type: Number, required: true },
  status: { type: String, default: "Available" },
  type: { type: String, enum: ["new", "used"], default: "used" },
  regno: {type: String, required: true}
}, { timestamps: true });

carSchema.pre("findOneAndDelete", async function (next) {
  const carId = this.getQuery()["_id"];
  if (carId) {
    await mongoose.model("Images").deleteMany({ carId });
    await mongoose.model("Features").deleteMany({ carId });
    await mongoose.model("CarDetails").deleteMany({ carId });
    await mongoose.model("Location").deleteMany({ carId });
  }
  next();
});

export default mongoose.model("Car", carSchema);

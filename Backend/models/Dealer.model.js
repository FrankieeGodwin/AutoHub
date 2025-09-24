import mongoose from "mongoose";
import DealerStats from "./dealerStats.model.js";

const dealerSchema = new mongoose.Schema({
  DealerName: { type: String, required: true },
  Email: { type: String, required: true, unique: true },
  PhoneNumber: { type: String },
  BusinessLicenseNumber: { type: String },
  GSTNumber: { type: String },
  PasswordHash: { type: String, required: true },
  CarsListed: [{ type: String }],
},{ timestamps: true });

dealerSchema.pre('findOneAndDelete', async function(next) {
  const dealer = await this.model.findOne(this.getFilter());
  if (dealer) {
    await DealerStats.deleteOne({ DealerId: dealer._id });
  }
  next();
});

export default mongoose.model("Dealer", dealerSchema);

import mongoose from "mongoose";

const dealerStatsSchema = new mongoose.Schema({
  DealerId: { type: String, required: true },
  TotalCarsSold: { type: Number, default: 0 },
  TotalRevenue: { type: Number, default: 0 },
  CarsSoldList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Car' }] 
},{ timestamps: true });

export default mongoose.model("DealerStats", dealerStatsSchema);


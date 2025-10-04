import mongoose from "mongoose";

const newCarSchema = new mongoose.Schema({
  brand: { type: String, required: true },               // e.g., "Hyundai"
  modelName: { type: String, required: true },           // e.g., "Creta"
  variant: { type: String, required: true },             // e.g., "SX 1.5 Petrol"
  
  bodyType: { type: String },                            // e.g., "SUV", "Sedan"
  fuelTypes: [{ type: String }],                         // e.g., ["Petrol", "Diesel", "CNG", "Electric"]
  transmissions: [{ type: String }],                     // e.g., ["Manual", "Automatic"]
  driveTypes: [{ type: String }],                        // e.g., ["FWD", "RWD", "AWD", "4WD"]

  engines: [
    {
      engineType: { type: String },                      // e.g., "1.5L Petrol"
      displacement: { type: Number },                    // in cc
      power: { type: String },                           // e.g., "115 bhp"
      torque: { type: String },                          // e.g., "144 Nm"
      cylinders: { type: Number },                       // e.g., 4
      fuelEfficiency: { type: String }                   // e.g., "16 km/l"
    }
  ],

  colors: [{ type: String }],                            // e.g., ["Red", "Blue", "White", "Black"]

  dimensions: {
    length: { type: Number },                            // in mm
    width: { type: Number },
    height: { type: Number },
    wheelbase: { type: Number },
    groundClearance: { type: Number },
    bootSpace: { type: Number },                         // liters
    seatingCapacity: { type: Number }
  },

  priceRange: {
    min: { type: Number, required: true },               // e.g., 1000000
    max: { type: Number, required: true }                // e.g., 1700000
  },

  additionalFeatures: {
    safety: [String],                                    // e.g., ["Airbags", "ABS", "ESP"]
    interior: [String],                                  // e.g., ["Leather Seats", "Ambient Lighting"]
    exterior: [String],                                  // e.g., ["LED Headlights", "Sunroof"]
    technology: [String],                                // e.g., ["Touchscreen", "Apple CarPlay"]
    convenience: [String]                                // e.g., ["Keyless Entry", "Cruise Control"]
  },

  media: {
    images: [String],                                    // ["img1.jpg", "img2.jpg"]
    videos: [String],                                    // ["vid1.mp4", "vid2.mp4"]
    model3D: { type: String },                           // "car3d.glb"
    pano360: [String]                                    // ["pano1.jpg", "pano2.jpg"]
  },

  dealer: { type: mongoose.Schema.Types.ObjectId, ref: "Dealer", required: true },
  stock: { type: Number, default: 0 },                   // total available units

  description: { type: String },                         // free text
}, { timestamps: true });

export default mongoose.model("NewCar", newCarSchema);

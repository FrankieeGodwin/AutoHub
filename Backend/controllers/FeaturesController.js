import Features from "../models/Features.model.js";

export const addFeatures = async (req, res) => {
  try {
    const features = new Features(req.body);
    await features.save();
    res.status(201).json(features);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getFeaturesByCarId = async (req, res) => {
  try {
    const features = await Features.findOne({ carId: req.params.carId });
    res.status(200).json(features);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

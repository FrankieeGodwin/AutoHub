import CarDetails from "../models/CarDetails.model.js";

export const addCarDetails = async (req, res) => {
  try {
    const details = new CarDetails(req.body);
    await details.save();
    res.status(201).json(details);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getCarDetailsByCarId = async (req, res) => {
  try {
    const details = await CarDetails.findOne({ carId: req.params.id });
    res.status(200).json(details);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

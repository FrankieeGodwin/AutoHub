import Location from "../models/Location.model.js";

export const addLocation = async (req, res) => {
  try {
    const location = new Location(req.body);
    await location.save();
    res.status(201).json(location);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getLocationByCarId = async (req, res) => {
  try {
    const location = await Location.findOne({ carId: req.params.id });
    res.status(200).json(location);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

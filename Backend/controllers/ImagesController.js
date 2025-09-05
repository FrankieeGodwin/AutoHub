import Images from "../models/Images.model.js";

export const addImage = async (req, res) => {
  try {
    const image = new Images(req.body);
    await image.save();
    res.status(201).json(image);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getImagesByCarId = async (req, res) => {
  try {
    const images = await Images.find({ carId: req.params.id });
    res.status(200).json(images);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

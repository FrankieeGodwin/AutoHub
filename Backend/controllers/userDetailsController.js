import UserDetails from '../models/userDetails.model.js';

export const createUserDetails = async (userId) => {
  try {
    const details = await UserDetails.create({
      userId: userId,
      carsBought: [],
      carsSold: []
    });
    return details;
  } catch (err) {
    throw err;
  }
};

export const getAllUserDetails = async (req, res) => {
  try {
    const details = await UserDetails.find()
      .populate('userId')        
      .populate('carsBought')     
      .populate('carsSold');      

    res.status(200).json(details);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addCarToBought = async (req, res) => {
  const { userId, carId } = req.body;

  try {
    const updatedDetails = await UserDetails.findOneAndUpdate(
      { userId: userId },
      { $addToSet: { carsBought: carId } }, 
      { new: true, upsert: true }
    )
      .populate('userId')
      .populate('carsBought')
      .populate('carsSold');

    res.status(200).json({ success: true, data: updatedDetails });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const addToFavorites = async (req, res) => {
  try {
    const { userId , carId } = req.body;

    if (!carId) {
      return res.status(400).json({ message: "carId is required." });
    }

    // Find the user's details
    const userDetails = await UserDetails.findOne({ userId });

    if (!userDetails) {
      return res.status(404).json({ message: "User details not found." });
    }

    // Check if the car is already in favorites
    if (userDetails.favorites.includes(carId)) {
      return res.status(400).json({ message: "Car already in favorites." });
    }

    // Add to favorites
    userDetails.favorites.push(carId);
    await userDetails.save();

    return res.status(200).json({
      message: "Car added to favorites successfully.",
      favorites: userDetails.favorites,
    });
  } catch (error) {
    console.error("Error adding to favorites:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

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
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
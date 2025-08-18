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

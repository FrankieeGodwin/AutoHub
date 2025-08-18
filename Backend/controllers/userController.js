import User from '../models/user.model.js';
import { createUserDetails } from './userDetailsController.js';

export const createUser = async (req, res) => {
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();

    const userDetails = await createUserDetails(savedUser._id);

    res.status(201).json({ user: savedUser, userDetails });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

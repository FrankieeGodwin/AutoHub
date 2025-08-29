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

export const login = async (req, res) => {
  try {
    const {emailId, passwordHash}=req.body;
    const user = await User.findOne({ emailId : emailId });
    if(!user)
      {
        res.status(404).json({message:"User Not Found"});
      }
      else{
        if(user.passwordHash==passwordHash)
        {
          res.status(200).json(user);
        }
      } 
  }
  catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find(); 
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User and related UserDetails deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
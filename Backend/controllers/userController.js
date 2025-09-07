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
        return res.status(404).json({message:"User Not Found"});
      }
      
        if(user.passwordHash===passwordHash)
        {
          return res.status(200).json({
          userId: user._id,
          emailId: user.emailId,
          fullName: user.fullName
          });
        }
        else{
          return res.status(401).json({message: "Wrong Password"});
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

export const getUserById = async (req, res) => {
  try {
    const userId= req.params.id;
    const user = await User.findById(userId);
    if(!user){
      return res.status(404).json({message:"User Not Found"});
    }
    res.status(200).json(user);
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
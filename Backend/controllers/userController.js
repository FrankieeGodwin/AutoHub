import jwt from "jsonwebtoken";
import User from '../models/user.model.js';
import { createUserDetails } from './userDetailsController.js';

// 1. Create user (Signup)
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

// 2. Login (Generate JWT token)
export const login = async (req, res) => {
  try {
    const { emailId, passwordHash } = req.body;
    const user = await User.findOne({ emailId });

    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    if (user.passwordHash === passwordHash) {
      // generate token
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      return res.status(200).json({
        token,
        userId: user._id,
        emailId: user.emailId,
        fullName: user.fullName,
        phoneNo: user.phoneNo,
      });
    } else {
      return res.status(401).json({ message: "Wrong Password" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Get all users (only for admin / protected route)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-passwordHash");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. Get single user by ID (protected route)
export const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select("-passwordHash");
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } 
};

// 5. Delete user (protected route)
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

// 6. Update user (protected route)
export const updateUser = async (req, res) => {
  try {
    const { id } = req.user; // comes from authMiddleware
    const updates = req.body;

    const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true }).select("-passwordHash");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { emailId, newPassword } = req.body;

    if (!emailId || !newPassword) {
      return res.status(400).json({ message: "Email and new password are required" });
    }

    const updatedUser = await User.findOneAndUpdate(
      { emailId },
      { passwordHash: newPassword },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
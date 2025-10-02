import Dealer from "../models/Dealer.model.js"
import DealerStats from "../models/dealerStats.model.js";
import jwt from "jsonwebtoken";

export const createDealer = async (req, res) => {
  try {
    const newDealer = new Dealer(req.body);
    const savedDealer = await newDealer.save();

    const dealerStats = new DealerStats({
      DealerId: savedDealer._id, 
      TotalCarsSold: 0,
      TotalRevenue: 0,
      CarsSoldList: []
    });

    const savedDealerStats = await dealerStats.save();

    res.status(201).json({
      dealer: savedDealer,
      dealerStats: savedDealerStats
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const dealerLogin = async (req, res) => {
  try {
    const { Email, PasswordHash } = req.body;
    const dealer = await Dealer.findOne({ Email });

    if (!dealer) {
      return res.status(404).json({ message: "Dealer Not Found" });
    }

    if (dealer.PasswordHash === PasswordHash) {
      const token = jwt.sign(
        { id: dealer._id, role: "dealer" },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      return res.status(200).json({
        token,
        dealer
      });
    } else {
      return res.status(401).json({ message: "Wrong Password" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllDealers = async (req, res) => {
  try {
    const dealers = await Dealer.find().select("-PasswordHash"); 
    // exclude password hash for security

    if (!dealers || dealers.length === 0) {
      return res.status(404).json({ message: "No dealers found" });
    }

    res.status(200).json(dealers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export async function deleteDealer(req, res) {
  try {
    const deletedDealer = await Dealer.findByIdAndDelete(req.params.dealerId);

    if (!deletedDealer) {
      return res.status(404).json({ message: 'Dealer not found' });
    }

    return res.status(200).json({ message: 'Dealer deleted successfully' });
  } catch (error) {
    console.error('Error deleting dealer:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export const getDealerById = async (req, res) => {
  try {
    const { id } = req.params; 
    const dealer = await Dealer.findById(id);

    if (!dealer) {
      return res.status(404).json({ message: "Dealer not found" });
    }

    res.status(200).json(dealer);
  } catch (error) {
    console.error("Error retrieving dealer by id:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};